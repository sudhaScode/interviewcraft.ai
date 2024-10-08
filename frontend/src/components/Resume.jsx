import React, { useRef, useState } from "react";
import styles from "./Resume.module.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from "react-redux";
import { handleUpload, push, update , handleError} from "../Reduxstore/Store";
import { URL_ENDPOINT } from "../constants/Config";

function Resume({ className }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch();
    const hasError = useSelector(state=>state.flow.hasError)
    const isUploaded = useSelector(state=>state.flow.isUploaded)
    const isLogin= useSelector(state=>state.flow.isLogin)
    const handleFileClick = (event) => {
        event.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        event.stopPropagation();
        const file = event.target.files[0];
        if (file) {
            sessionStorage.setItem("fileName", file.name);
            setSelectedFile(file);
        }
        dispatch(handleError(false))
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            //console.log("here")
            const response = await fetch(`${URL_ENDPOINT}/api/load/`, {
                method: "POST",
                body: formData,
            });
            if (response.status === 200) {
                dispatch(handleUpload(true));
                dispatch(update());//removes component

                const message = {
                    name: "Craft.ai",
                    key: "bot-resume-res",
                    response: "Thanks for providing the resume. I'm excited to help you with your career journey. I offer a range of services to help you stand out in the job market, including resume enhancement, interview preparation, and mock interviews. Let me know how I can assist you today!"
                };
                dispatch(push(message));
                setSelectedFile(null); // Reset file input after successful upload
                let resume = sessionStorage.getItem("fileName");
                if(resume){
                 resume = resume.substring(0, resume.length/2).trim()
                    sessionStorage.setItem("resume_id", `${resume}${Math.floor(Math.random()*99)+99}`)
                }
                
            } else {
                
                if(response.status === 204){
                    throw new Error("No content in Resume");
                }
            }
        } catch (error) {
            dispatch(handleError(true))
            setSelectedFile(null);
            setErrorMessage(error.message)
            if(fileInputRef.current){
                fileInputRef.current.value = ""
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        { !isUploaded?
            <div className={`${styles["form-container"]} ${className}`}>
            <form onSubmit={handleFileUpload}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    required
                />
                <div>
                    {!selectedFile ? (
                        <button
                            type="button"
                            className={styles["resume-button"]}
                            onClick={handleFileClick}
                        >
                            <CloudUploadIcon className={styles["cloud-icon"]} />
                            <p className={styles.selector}>SELECT RESUME</p>
                        </button>
                    ) : (
                        <button type="button" className={styles["resume-button"]}>
                            <p className={styles["resume-selected"]}>RESUME SELECTED</p>
                        </button>
                    )}
                </div>
                <div className={styles["checkbox-one"]}>
                    <input type="checkbox" id="checkOne" name="resumeenhancing" defaultChecked />
                    <label htmlFor="checkOne">Resume Enhancing</label>
                </div>
                <div className={styles["checkbox-two"]}>
                    <input type="checkbox" id="checkTwo" name="interviewpreparation" defaultChecked />
                    <label htmlFor="checkTwo">Interview Preparation</label>
                </div>
                <div className={styles["checkbox-three"]}>
                    <input type="checkbox" id="checkThree" name="mockinterview" defaultChecked />
                    <label htmlFor="checkThree">Mock Interview</label>
                </div>
                <button
                    type="submit"
                    className={!selectedFile ? styles["submit-button"] : styles["submit-button-activated"]}
                    disabled={isLoading}
                >
                    UPLOAD
                </button>
            </form>
            {isLoading && <p className={styles.selected}>Setting up prompts...</p>}
            {hasError && !isUploaded && <p className={styles.error}>{errorMessage}</p>}
            {hasError && !isUploaded && <p className={styles.error}>Please Try with another resume</p>}
        </div> :<p></p>
        }
        </>
    );
}

export default Resume;


/**
 import React from "react";
import styles from "./Resume.module.css";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
//import { grey } from '@mui/material/colors';


function Resume() {
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
      


    return (
        <div className={styles["form-container"]}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                backgroundColor="#b28704"
            >
                SELECT RESUME
                <VisuallyHiddenInput type="file" />
            </Button>

        </div>
    );
}

export default Resume;
 */