import { useState, useEffect } from "react";
import "./App.css";

import PocketBase from "pocketbase";

function App() {
    const [recordId, setRecordId] = useState(null);

    useEffect(() => {
        const pb = new PocketBase("https://pocketbase.louisrvl.fr");

        // const data = {
        //     ahs_max: 123,
        //     ahs_min: 123,
        //     botanic: "test",
        //     genre: "test",
        //     koppen: "test",
        //     mycorrhizae: "test",
        //     name: "HAHA",
        //     ph_max: 123,
        //     ph_min: 123,
        //     usda_max: 123,
        //     usda_min: 123,
        //     private: true,
        // };

        pb.collection("sebr_species")
            .create(fichier)
            .then((response) => {
                console.log("Record created successfully:", response);
                setRecordId(response.id);
            })
            .catch((error) => {
                console.error("Error creating record:", error);
            });
    }, []);

    const JsonFichier = async (event) => {
        try {
            const fichier = event.target.file[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fichiertruc = JSON.parse(event.taerget.result);
                for (const record of fichier.records) {
                    const Ajout = await Verification(record.name, record.genre);
                    if (Ajout) {
                        const record = await pb
                            .collection("sebr_species")
                            .create(fichier);
                        console.log("Enregistrement ajouté");
                    }
                }
            };
        } catch (error) {
            console.log("ERREUR");
        }
    };
    // const Verification = async () => {
    //     try {
    //         const present = await pb
    //             .collection("sebr_species")
    //             .where("name", "==", fichiertruc.name)
    //             .where("genre", "==", fichiertruc.genre)
    //             .get();
    //         if (present.lenght > 0) {
    //             console.log("Erreur");
    //             return false;
    //         } else {
    //             return true;
    //         }
    //     } catch (error) {
    //         console.error("Erreur lors de la vérif");
    //     }
    // };
    // const Ajout = async () => {
    //     const isUnique = await Verification();
    //     if (isUnique) {
    //         try {
    //             const record = await pb.collection("sebr_species").create(data);
    //             console.log("Enregistrement ajouté avec succès !");
    //         } catch (error) {
    //             console.error(
    //                 "Erreur lors de l'ajout de l'enregistrement :",
    //                 error
    //             );
    //         }
    //     }
    // };

    return (
        <div>
            <input type="file" accept=".json" onChange={JsonFichier} />
            {recordId
                ? `Record created with ID: ${recordId}`
                : "Creating record..."}
        </div>
    );
}

export default App;
