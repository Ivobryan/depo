import mongoose from "mongoose";
import dotenv from "dotenv";
import Business from "../models/Business.js";
import Beer from "../models/Beer.js";
import DailyRecord from "../models/DailyRecord.js";
import InventoryMovement from "../models/InventoryMovement.js";
import CrateLoan from "../models/CrateLoan.js";
import EmptyCrate from "../models/EmptyCrate.js";

dotenv.config();

const resetDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not set in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to: ${mongoose.connection.name}`);

    // Safety check: require explicit --force flag to actually delete
    const hasForce = process.argv.includes("--force");
    if (!hasForce) {
      console.log("\n--- DRY RUN (no data deleted) ---");
      console.log("Counts before deletion:");
      console.log(" Businesses:", await Business.countDocuments());
      console.log(" Beers:", await Beer.countDocuments());
      console.log(" DailyRecords:", await DailyRecord.countDocuments());
      console.log(" InventoryMovements:", await InventoryMovement.countDocuments());
      console.log(" CrateLoans:", await CrateLoan.countDocuments());
      console.log(" EmptyCrates:", await EmptyCrate.countDocuments());
      console.log("\nTo actually wipe data, run:");
      console.log("  npm run reset-db -- --force");
      console.log("\nThis will:");
      console.log(
        " - Delete ALL Businesses, Beers, DailyRecords, InventoryMovements,",
      );
      console.log("   CrateLoans, and EmptyCrates");
      console.log(" - Preserve ALL Users, including their email and password hashes");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("\n--- WIPE STARTED (--force) ---");

    const delBusiness = await Business.deleteMany({});
    console.log(`Deleted ${delBusiness.deletedCount} businesses`);

    const delBeer = await Beer.deleteMany({});
    console.log(`Deleted ${delBeer.deletedCount} beers`);

    const delDaily = await DailyRecord.deleteMany({});
    console.log(`Deleted ${delDaily.deletedCount} daily records`);

    const delInv = await InventoryMovement.deleteMany({});
    console.log(`Deleted ${delInv.deletedCount} inventory movements`);

    const delLoans = await CrateLoan.deleteMany({});
    console.log(`Deleted ${delLoans.deletedCount} crate loans`);

    const delEmptyCrates = await EmptyCrate.deleteMany({});
    console.log(`Deleted ${delEmptyCrates.deletedCount} empty crate records`);

    console.log("\n--- WIPE COMPLETE ---");
    console.log("All non-user data was deleted.");
    console.log("All user records and credentials were preserved.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
};

resetDatabase();
