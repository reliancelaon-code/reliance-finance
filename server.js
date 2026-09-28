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

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// SUPABASE CLIENT
function getSupabase() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
        throw new Error("Supabase environment variables missing");
    }

    return createClient(url, key);
}

// SUBMIT APPLICATION
app.post("/submit-application", async (req, res) => {
    try {
        const application = req.body;

        if (!application.name || !application.mobile) {
            return res.status(400).json({
                success: false,
                message: "Name aur mobile number required hai."
            });
        }

        const supabase = getSupabase();

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
        const supabase = getSupabase();

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

        return res.json(applications);

    } catch (error) {
        console.log("Server Error:", error);

        return res.status(500).json({
            success: false,
            message: "Applications load nahi hui."
        });
    }
});

// LOCAL SERVER
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log("RELIANCE FINANCE SERVER RUNNING ON PORT " + PORT);
    });
}

module.exports = app;