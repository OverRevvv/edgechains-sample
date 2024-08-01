# EdgeChains Sample app | Chat-With-Spreadsheet
## based on the Chat-with-PDF

# Run the ChatWithSpreadsheet example

This section provides instructions for developers on how to utilize the chat with PDF feature. By following these steps, you can integrate the functionality seamlessly into your projects.

---

2. Install packages with npm

``` 
  npm install
```

3. Setup you secrets in `secrets.jsonnet`
```
  local SUPABASE_API_KEY = "your supabase api key here";


  local OPENAI_API_KEY = "your openai api key here";
    
  local SUPABASE_URL = "your supabase url here";
    
  {
    "supabase_api_key":SUPABASE_API_KEY,
    "supabase_url":SUPABASE_URL,
    "openai_api_key":OPENAI_API_KEY,
  }
   
```
4. Build the the packge
```sh
npm run build
```
5. Run the app
```sh
npm run start
```