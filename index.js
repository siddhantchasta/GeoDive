import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));
// app.set("view engine", "ejs");

const BASE_URL = "https://restcountries.com/v3.1";


// Home page
app.get("/", async (req, res) =>{
    try {
        const sampleCountries = ["India", "France", "Brazil"];
	    const responses = await Promise.all(sampleCountries.map(country => axios.get(`${BASE_URL}/name/${country}?fullText=true`)));
        const countries = responses.map(resp => resp.data[0]);
        res.render("index.ejs", { countries });
    } catch (error) {
	    console.error(error);
        res.send("Error loading sample countries");
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Random Country
app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    const allCountries = response.data;

    // Shuffle and pick 3 random countries
    const shuffled = allCountries.sort(() => 0.5 - Math.random());
    const randomThree = shuffled.slice(0, 3);

    res.render("index.ejs", { countries: randomThree });
  } catch (error) {
    console.error("Error fetching random countries:", error);
    res.send("Error loading random countries");
  }
});


// Handle Search
app.post("/search", async(req, res) =>{
    const {type, query} = req.body;
    let endpoint = "";

    switch(type){
        case "name" : 
            endpoint = `/name/${query}`;
            break;
        case "capital" : 
            endpoint = `/capital/${query}`;
            break;
        case "language" :
            endpoint = `/lang/${query}`;
            break;
        default :
            res.send("Invalid Search Type");
    }

    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        res.render("results.ejs", {countries : response.data});
    } catch(error){
        console.error(error);
        res.status(404).render("404.ejs");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});