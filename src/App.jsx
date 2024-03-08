import { useState, useEffect } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, JsonInput, MantineProvider, Text, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import "./App.css";
import "@mantine/core/styles.css";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.louisrvl.fr");
pb.autoCancellation(false);
function App(props) {
    const [recordId, setRecordId] = useState(null);
    const [newfile, setNewFile] = useState(null);
    const [veriftest, setVerifTest] = useState(false);
    const [good, setGood] = useState(0);
    const [bad, setBad] = useState(0);

    const jsonFichier = async () => {
        try {
            let fileAsString = await newfile.text();
            let fileAsJson = JSON.parse(fileAsString);
            fileAsJson.forEach(async (element) => {
                const isValid = Verification(element);
                if (isValid) {
                    try {
                        const result = await pb
                            .collection("sebr_species")
                            .create(element);
                        setGood(good + 1);
                        console.log("Result:", element);
                    } catch (error) {
                        console.log("Error:", error);
                    }
                } else {
                    console.log("raté");
                }
            });
            // //on récupère les données
            // const reader = new FileReader();
            // reader.onload = async (event) => {
            //     console.log(event.target.result);
            //     //on parse les données
            //     const bonzaiList = JSON.parse(event.target.result);
            //     //On vérifie si les données existent déjà ou pas (Verification)
            //     //on envoie les données vers pocketbase

            //     bonzaiList.forEach(async (element) => {
            //         const isValid = Verification(element);
            //         if (isValid) {
            //             try {
            //                 const result = await pb
            //                     .collection("sebr_species")
            //                     .create(element);
            //                 console.log("Result:", element);
            //             } catch (error) {
            //                 console.log("Error:", error);
            //             }
            //         } else {
            //             console.log("raté");
            //         }
            //     });
            // };
            // reader.readAsText(newfile);
        } catch (error) {
            console.log("eeeerrerere", error);
            console.log("USESTATE TEST", newfile);
        }
    };
    const Verification = async (bonzaiList) => {
        try {
            const present = await pb
                .collection("sebr_species")
                .getFirstListItem(
                    'name="' +
                        bonzaiList.name +
                        '" && genre="' +
                        bonzaiList.genre +
                        '"'
                );
            // console.log("LAAAAAAAAAAAAAAAAAAAAAA", present);
            if (present) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
                setGood(good + 1);

                return false;
            } else {
                console.log("OKAAAAAAAAYYYYYYYYYYYY");
                setBad(bad + 1);

                return true;
            }
        } catch (error) {
            console.error("Ce fichier n'existe pas ! Il peut etre push");
            console.log("ICICICICICICICIC", error);
            return true;
        }
        return true;
    };
    // const Ajout = async () => {
    //     const solo = await Verification();
    //     if (solo) {
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
    console.log(newfile);
    return (
        <MantineProvider>
            <Dropzone
                onDrop={(files) => {
                    setNewFile(files[0]);
                }}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={["application/json"]}
                {...props}
                type="file"
                // onChange={(e) => {
                //     console.log(e);
                //     setNewFile(e.target.files[0]);
                // }}
            >
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                >
                    <Dropzone.Accept>
                        <IconUpload
                            style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-blue-6)",
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-red-6)",
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto
                            style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-dimmed)",
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should
                            not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>
            <input
                type="file"
                accept=".json"
                onChange={(e) => {
                    console.log(e);
                    setNewFile(e.target.files[0]);
                }}
            />
            <button onClick={jsonFichier}>Envoyer</button>
            <div>{good}</div>
            <div>{bad}</div>
            {recordId ? `${recordId}` : "Création"}
        </MantineProvider>
    );
}

export default App;
