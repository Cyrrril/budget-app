import { AppDataSource } from "../models/data-source";
import { Category } from "../models/category.entity";

export const seedCategories = async () => {
  try {
    const repo = AppDataSource.getRepository(Category);
    const existing = await repo.count();
    if (existing > 0) return;

    const categories: Partial<Category>[] = [
      { name: "Food", icon: "FaUtensils" },
      { name: "Train", icon: "FaTrainSubway" },
      { name: "Flight", icon: "FaPlane" },
      { name: "Sport", icon: "FaRunning" },
      { name: "Reading", icon: "FaBook" },
      { name: "Games", icon: "FaGamepad" },
      { name: "Car", icon: "FaCar" },
      { name: "Miscellaneous", icon: "FaQuestionCircle" },

      { name: "Spotify", icon: "SiSpotify" },
      { name: "Netflix", icon: "SiNetflix" },
      { name: "AWS", icon: "SiAmazonaws" },

      {
        name: "Custom Cloud",
        iconUrl: "/icons/cloud.png", // Public folder in frontend
      },
    ];

    await repo.clear();
    await repo.save(categories);
  } catch (error) {
    console.log(error);
  }
};
