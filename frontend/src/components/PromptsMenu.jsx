import React, { useEffect, useState } from "react";
import styles from "./PromptsMenu.module.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { resume, interview, mock } from "../constants/prompts";
import { useDispatch, useSelector } from "react-redux";
import { handleReset, push } from "../Reduxstore/Store";

function PromptsMenu() {
    const [show, setShow] = useState(true);
    const [activePrompt, setActivePrompt] = useState("");
    const dispatch = useDispatch();
    const mockenv = useSelector(state => state.flow.isMock);

    const handleOptionClick = (promptType) => {
        setShow(false)
        setActivePrompt(activePrompt === promptType ? "" : promptType);
    };

    const resetHandler = () => {
        localStorage.removeItem("fileName");
        dispatch(handleReset())
        const message = {
            name: "Craft.ai",
            key: "bot-resume-res",
            response: "Hey! You asked to reset services, please upload your resume to get started again...",
            componentType: "Resume"
        };
        dispatch(push(message));
    };
    useEffect(()=>{
     if(show){
        setActivePrompt("")
     }
    },[show])

    return (
        <div className={styles["left-nav"]}>
            <div className={styles["nav-container"]}>
                <button 
                    className={styles["dropdown-prompts"]} 
                    onMouseOver={() => setShow(true)}
                    onClick={()=>setShow(prev =>!prev)}
                   
                >
                    Prompts
                    <KeyboardArrowDownIcon className={show ? `${styles["drop-icon"]} ${styles["rotate"]}`:styles["drop-icon"]} />
                </button>
                {show && (
                    <div className={styles["prompt-menu"]}>
                        <ul>
                            {!mockenv && (
                                <> 
                                    <li>
                                        <button
                                            className={activePrompt === "resume" ? styles["menu-button-active"] : styles["menu-button"]}
                                            onClick={() => handleOptionClick("resume")}
                                        >
                                            Resume Enhancement
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className={activePrompt === "interview" ? styles["menu-button-active"] : styles["menu-button"]}
                                            onClick={() => handleOptionClick("interview")}
                                        >
                                            Interview Preparation
                                        </button>
                                    </li>
                                </>
                            )}
                            {mockenv && (
                                <li>
                                    <button
                                        className={activePrompt === "mock" ? styles["menu-button-active"] : styles["menu-button"]}
                                        onClick={() => handleOptionClick("mock")}
                                    >
                                        Mock Interview
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {!mockenv && activePrompt === "resume" && (
                <div className={styles["prompts-list"]}>
                    <div className={styles["prompts-container"]}>
                        {resume.map((prompts, index) => <div key={index}>
                         <h2 className={styles.predefined}>{prompts.type}</h2>
                         {prompts.prompts.map((prompt,index)=><p key={index}>{prompt}</p>)}
                        </div>)}
                    </div>
                </div>
            )}
            {!mockenv && activePrompt === "interview" && (
                 <div className={styles["prompts-list"]}>
                 <div className={styles["prompts-container"]}>
                     {interview.map((prompts, index) => <div key={index}>
                      <h2 className={styles.predefined}>{prompts.type}</h2>
                      {prompts.prompts.map((prompt,index)=><p key={index}>{prompt}</p>)}
                     </div>)}
                 </div>
             </div>
            )}
            {mockenv && activePrompt === "mock" && (
                <div className={styles["prompts-list"]}>
                    <p className={styles.check}>
                        <label htmlFor="mock" style={{ cursor: "pointer" }}>
                            Make sure to check Mock Interview for better results.
                        </label>
                    </p>
                    <div className={styles["prompts-container"]}>
                    {mock.map((prompts, index) => <div key={index}>
                      <h2 className={styles.predefined}>{prompts.type}</h2>
                      {prompts.prompts.map((prompt,index)=><p key={index}>{prompt}</p>)}
                     </div>)}
                    </div>
                </div>
            )}
            {/* <button className={styles.reset} onClick={resetHandler}>
                Reset
            </button> */}
        </div>
    );
}

export default PromptsMenu;
