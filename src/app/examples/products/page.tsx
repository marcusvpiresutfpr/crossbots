import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

interface Props {
  searchParams: {
    category?: string;
    skip?: string;
  };
}

export default async function Products({ searchParams }: Props) {
  const category = searchParams.category ?? "";
  const skip = searchParams.skip ?? "0";

  console.log("Category:", category);
  console.log("Skip:", skip);

  const skipCount = parseInt(skip, 10) || 0;

  const categories = await prisma.shopCategory.findMany();

  const products = await (async () => {
    if (category) {
      return prisma.shopProduct.findMany({
        where: {
          shopCategoryLinks: {
            some: {
              category: {
                name: category,
              },
            },
          },
        },
        include: {
          shopCategoryLinks: {
            include: {
              category: true,
            },
          },
          relatedRobot: true,
          relatedCompetition: true,
          relatedRobotCategory: true,
        },
        skip: skipCount,
        take: 10,
      });
    }

    return prisma.shopProduct.findMany({
      include: {
        shopCategoryLinks: {
          include: {
            category: true,
          },
        },
        relatedRobot: true,
        relatedCompetition: true,
        relatedRobotCategory: true,
      },
      skip: skipCount,
      take: 10,
    });
  })();

  if (!products || products.length === 0) {
    return <div>No products found for this category.</div>;
  }

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-w-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="flex justify-between items-center mb-4">
          <Link href="/examples/products?skip=0" className="btn btn-primary">
            Reset
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              className="btn"
              href={`/examples/products?category=${cat.name}&skip=0`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="divider"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/examples/product/${product.id}/view`}
              className="card bg-base-100 shadow-xl"
            >
              <figure className="h-64 overflow-hidden">
                <Image
                  width={300}
                  height={300}
                  src={product.imageUrl || "/default-product.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p>{product.description}</p>
                <div className="card-actions justify-between items-center">
                  <div className="text-lg font-bold text-primary">
                    ${(product.priceCents / 100).toFixed(2)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.shopCategoryLinks.map((link) => (
                      <div key={link.category.id} className="badge badge-outline badge-sm">
                        {link.category.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
