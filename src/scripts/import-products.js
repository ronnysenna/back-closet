// Script para importar produtos do arquivo JSON para o banco de dados PostgreSQL via Prisma
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

// Obtendo o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialização do Prisma
const prisma = new PrismaClient();

// Função para gerar slugs a partir de títulos
const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: "pt",
  });
};

// Função para ler o arquivo JSON de produtos
const readProductsJson = () => {
  try {
    // Caminho para o arquivo products.json na raiz do projeto
    const filePath = path.join(__dirname, "..", "..", "products.json");
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao ler o arquivo products.json:", error);
    process.exit(1);
  }
};

// Função para limpar os dados e formatá-los de acordo com o esquema do Prisma
const formatProductData = (product) => {
  // Conversão de preço e preço de varejo para números
  const price = parseFloat(product.price);
  const originalPrice = parseFloat(product.retailPrice);

  // Calcula o desconto percentual
  const discountPercentage =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Remova a barra inicial das URLs de imagens se necessário
  const fixImageUrl = (url) => (url.startsWith("/") ? url.substring(1) : url);

  const mainImage = fixImageUrl(product.imageUrl);
  const galleryImages = product.galleryImages.map(fixImageUrl);

  // Gera o slug a partir do título
  const slug = generateSlug(product.title);

  // Retorna o objeto formatado para o Prisma
  return {
    name: product.title,
    slug: slug,
    price: price,
    originalPrice: originalPrice,
    description: product.description,
    shortDescription: product.description.split(".")[0] + ".", // Usa a primeira frase como descrição curta
    mainImage: mainImage,
    discountPercentage: discountPercentage,
    featured: false, // Por padrão, não é destaque
    stockQuantity: product.stock,
    sku: product.id, // Usa o ID como SKU
    sizes: product.sizes,
    colors: product.colors,
  };
};

// Função para garantir que as categorias existam no banco de dados
const ensureCategories = async (products) => {
  // Extrai categorias únicas dos produtos
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  console.log(`Verificando ${uniqueCategories.length} categorias...`);

  const categoryMap = {};

  for (const categoryName of uniqueCategories) {
    // Verifica se a categoria já existe
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    // Se não existir, cria a categoria
    if (!existingCategory) {
      const slug = generateSlug(categoryName);
      const newCategory = await prisma.category.create({
        data: {
          name: categoryName,
          slug: slug,
          description: `Categoria de ${categoryName}`,
        },
      });
      categoryMap[categoryName] = newCategory.id;
      console.log(
        `✓ Categoria criada: ${categoryName} (id: ${newCategory.id})`
      );
    } else {
      categoryMap[categoryName] = existingCategory.id;
      console.log(
        `✓ Categoria encontrada: ${categoryName} (id: ${existingCategory.id})`
      );
    }
  }

  return categoryMap;
};

// Função para importar produtos para o banco de dados
const importProductsToDB = async (products) => {
  console.log(`Iniciando importação de ${products.length} produtos...`);

  try {
    // Primeiro, garante que todas as categorias existam
    const categoryMap = await ensureCategories(products);

    // Contadores para estatísticas
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const product of products) {
      try {
        // Formata os dados do produto
        const productData = formatProductData(product);

        // Verifica se o produto já existe pelo slug
        const existingProduct = await prisma.product.findUnique({
          where: {
            slug: productData.slug,
          },
        });

        let productId;

        if (existingProduct) {
          // Atualiza o produto existente
          const updatedProduct = await prisma.product.update({
            where: {
              id: existingProduct.id,
            },
            data: productData,
          });
          productId = updatedProduct.id;
          updated++;
          console.log(
            `✓ Produto atualizado: ${productData.name} (id: ${productId})`
          );
        } else {
          // Cria um novo produto
          const newProduct = await prisma.product.create({
            data: productData,
          });
          productId = newProduct.id;
          created++;
          console.log(
            `✓ Produto criado: ${productData.name} (id: ${productId})`
          );
        }

        // Agora trata as imagens do produto
        if (productId) {
          // Apaga as imagens existentes se estiver atualizando
          if (existingProduct) {
            await prisma.productImage.deleteMany({
              where: {
                productId: productId,
              },
            });
          }

          // Adiciona as imagens da galeria
          const galleryImages = product.galleryImages || [];
          for (let i = 0; i < galleryImages.length; i++) {
            const imageUrl = galleryImages[i].startsWith("/")
              ? galleryImages[i].substring(1)
              : galleryImages[i];

            await prisma.productImage.create({
              data: {
                productId: productId,
                url: imageUrl,
                alt: `${product.title} - Imagem ${i + 1}`,
                order: i,
              },
            });
          }

          // Relaciona o produto com sua categoria
          const categoryId = categoryMap[product.category];

          if (categoryId) {
            // Remove relações existentes se estiver atualizando
            if (existingProduct) {
              await prisma.productCategory.deleteMany({
                where: {
                  productId: productId,
                },
              });
            }

            // Cria a relação entre produto e categoria
            await prisma.productCategory.create({
              data: {
                productId: productId,
                categoryId: categoryId,
              },
            });
          }
        }
      } catch (error) {
        console.error(
          `Erro ao processar o produto ${product.id} (${product.title}):`,
          error
        );
        errors++;
      }
    }

    console.log(`\n✅ Importação concluída!`);
    console.log(`   ${created} produtos criados`);
    console.log(`   ${updated} produtos atualizados`);

    if (errors > 0) {
      console.log(
        `   ⚠️ ${errors} produtos não puderam ser importados devido a erros`
      );
    }
  } catch (error) {
    console.error("Erro durante o processo de importação:", error);
    process.exit(1);
  } finally {
    // Encerra a conexão do Prisma
    await prisma.$disconnect();
  }
};

// Execução principal
const run = async () => {
  const products = readProductsJson();
  await importProductsToDB(products);
};

run().catch((err) => {
  console.error("Erro na execução principal:", err);
  prisma.$disconnect();
  process.exit(1);
});
