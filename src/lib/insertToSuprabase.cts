import fileURLToPath from "file-uri-to-path";
import { Spinner } from "cli-spinner";
import { createRequire } from "module";
import { Supabase } from "@arakoodev/edgechains.js/vector-db";
import Jsonnet from "@arakoodev/jsonnet";
import path from "path";
import { read, utils } from "xlsx"; 

const require = createRequire(import.meta.url);
const getEmbeddings = require("./getEmbeddings.cjs");
const __dirname = fileURLToPath(import.meta.url);

// Load secrets from jsonnet file
const secretsPath = path.join(__dirname, "../../../jsonnet/secrets.jsonnet");
const jsonnet = new Jsonnet();
const secretsLoader = jsonnet.evaluateFile(secretsPath);
const supabaseApiKey = await JSON.parse(secretsLoader).supabase_api_key;
const supabaseUrl = await JSON.parse(secretsLoader).supabase_url;
const supabase = new Supabase(supabaseUrl, supabaseApiKey);
const client = supabase.createClient();

export async function InsertToSupabase() {
  var spinner = new Spinner("Inserting to Supabase.. %s");
  try {
    spinner.setSpinnerString("|/-\\");
    spinner.start();

    const filePath = path.join(__dirname, "../../../example.xlsx"); // Update with your spreadsheet path
    const workbook = read(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet);

    for (let i = 0; i < jsonData.length; i++) {
      const rowString = JSON.stringify(jsonData[i]);
      if (rowString.length <= 1) {
        continue; // Skip empty rows
      }

      const response = await getEmbeddings()(rowString);
      if (response?.length > 0) {
        const element = response[0].embedding; 
        await supabase.insertVectorData({
          client,
          tableName: "documents",
          content: rowString.toLowerCase(),
          embedding: element,
        });
      }
    }
   
    console.log("Inserted to Supabase");
  } catch (error) {
    console.log("Error inserting to Supabase", error);
  } finally {
    spinner.stop();
  }
}

export async function splitedDocs(jsonData: any[], chunkSize: number = 500): Promise<string[][]> {
  const chunks: string[][] = [];
  for (let i = 0; i < jsonData.length; i += chunkSize) {
    const chunk = jsonData.slice(i, i + chunkSize);
    const chunkStrings = chunk.map(row => JSON.stringify(row));
    chunks.push(chunkStrings);
  }
  return chunks;
}

// Call function to begin the embedding process
InsertToSupabase();
