require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// PUBLIC FILES
app.use(express.static(path.join(__dirname, "public")));

// SUPABASE
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// SUBMIT APPLICATION
app.post("/submit-application", async (req, res) => {

    const application = req.body;

    if (!application.name || !application.mobile) {
        return res.status(400).json({
            success: false,
            message: "Name aur mobile number required hai."
        });
    }

    try {

        const { error } = await supabase
            .from("applications")
            .insert([
                {
                    data: application
                }
            ]);

        if (error) {
            console.log("Supabase Error:", error);

            return res.status(500).json({
                success: false,
                message: "Application save nahi hua."
            });
        }

        res.json({
            success: true,
            message: "Application successfully save ho gaya."
        });

    } catch (error) {

        console.log("Server Error:", error);

        res.status(500).json({
            success: false,
            message: "Application save nahi hua."
        });
    }
});

// GET APPLICATIONS
app.get("/applications", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.log("Supabase Error:", error);

            return res.status(500).json({
                success: false,
                message: "Applications load nahi hui."
            });
        }

        const applications = data.map((row) => ({
            id: row.id,
            date: row.created_at,
            ...(row.data || {})
        }));

        res.json(applications);

    } catch (error) {

        console.log("Server Error:", error);

        res.status(500).json({
            success: false,
            message: "Applications load nahi hui."
        });
    }
});

// SERVER START
if (process.env.VERCEL !== "1") {

    app.listen(PORT, () => {
        console.log("=================================");
        console.log("RELIANCE FINANCE SERVER");
        console.log("=================================");
        console.log("Server running on port " + PORT);
    });

}

module.exports = app;