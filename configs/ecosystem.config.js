module.exports = {
  apps: [
    {
      name: "hallohukum",
      script: "./app.ts",
      env: {
        NODE_ENV: "production",
        JWT_SECRET: "hallohukum",
        PORT: 80,
        MONGODB_URI:
          "mongodb+srv://danizrafidz:PjKHfWYfmniyjPhM@danzen.0pe3p.mongodb.net/hallohukum",
        GETSTREAM_API_KEY: "5zr932s5edbx",
        GETSTREAM_API_SECRET:
          "55p7ef68j8pvbemsr5razze3uy43spb95sgz495axte36uux99vmp2e8gsc9f2w8",
      },
    },
  ],
};
