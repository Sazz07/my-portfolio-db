export type TBlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    blogs: number;
  };
};
