require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
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
        const result = await supabase
            .from("applications")
            .insert([{ data: application }]);

        if (result.error) {
            console.log("Supabase Error:", result.error);

            return res.status(500).json({
                success: false,
                message: "Application save nahi hua."
            });
        }

        return res.json({
            success: true,
            message: "Application successfully save ho gaya."
        });

    } catch (error) {
        console.log("Server Error:", error);

        return res.status(500).json({
            success: false,
            message: "Application save nahi hua."
        });
    }
});

// GET APPLICATIONS
app.get("/applications", async (req, res) => {
    try {
        const result = await supabase
            .from("applications")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (result.error) {
            console.log("Supabase Error:", result.error);

            return res.status(500).json({
                success: false,
                message: "Applications load nahi hui."
            });
        }

        const applications = result.data.map(function (row) {
            return {
                id: row.id,
                date: row.created_at,
                ...(row.data || {})
            };
        });

        return res.json(applications);

    } catch (error) {
        console.log("Server Error:", error);

        return res.status(500).json({
            success: false,
            message: "Applications load nahi hui."
        });
    }
});

// SERVER START
if (process.env.VERCEL !== "1") {
    app.listen(PORT, function () {
        console.log("=================================");
        console.log("RELIANCE FINANCE SERVER");
        console.log("=================================");
        console.log("Server running on port " + PORT);
    });
}

module.exports = app;
