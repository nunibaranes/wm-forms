import React, { useContext, useEffect, useState } from "react";

import { ScreenType } from "../../../interfaces/screen/screen.interface";
import {
  IFormQuestionBE,
  IFormAnswerBE,
} from "../../../interfaces/form/form.interface";
import { AppContext } from "../../../App";

import MasterScreen from "../master-screen/MasterScreen";

export interface IOverviewScreenProps {}

export interface ISummaryItem {
  question: IFormQuestionBE;
  answerIds: number[];
}

const fakeSummary = [
  {
    question: {
      id: 9992,
      answers: [
        { id: 28205, isCorrect: true, text: "Correct answer" },
        { id: 28206, isCorrect: false, text: "Distractor option" },
      ],
      description: "",
      title: "Ask the first quiz question",
      type: 0,
    },
    answerIds: [28205], // correct
  },
  {
    question: {
      id: 10150,
      answers: [
        { id: 28605, isCorrect: true, text: "Correct answer" },
        { id: 28606, isCorrect: false, text: "Distractor option" },
        { id: 28607, isCorrect: true, text: "This is also a correct answer" },
        {
          id: 28608,
          isCorrect: false,
          text:
            "This option appears to confuse the user but this is not the a correct answer",
        },
        {
          id: 28609,
          isCorrect: true,
          text: "Select this option (this is also a correct answer)",
        },
        {
          id: 28610,
          isCorrect: false,
          text: "here are many variations of passages of Lorem Ipsum available",
        },
      ],
      description:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don&#39;t look even slightly believable. If you are going to use a passage of Lorem Ipsum",
      title:
        "An example of 190 characters question to check edge cases, using Lorem ipsum as a dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text.",
      type: 1,
    },
    answerIds: [28605, 28608, 28610], // wrong
  },
  {
    question: {
      id: 10151,
      answers: [
        {
          id: 28611,
          isCorrect: true,
          text:
            "Correct answer - The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
        },
        {
          id: 28612,
          isCorrect: false,
          text:
            "Distractor option - The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
        },
      ],
      description: "A short description",
      title:
        "This is the third question, you should know the answer, don&#39;t guess",
      type: 0,
    },
    answerIds: [28612], // wrong
  },
  {
    question: {
      id: 10152,
      answers: [
        {
          id: 28613,
          isCorrect: true,
          text: "Correct answer - Lorem Ipsum is simply dummy text",
        },
        { id: 28614, isCorrect: false, text: "Distractor option " },
        {
          id: 28615,
          isCorrect: true,
          text:
            " The point of using Lorem Ipsum is that it has a more-or-less normal distribution",
        },
      ],
      description: "",
      title: "What is Lorem Ipsum?",
      type: 1,
    },
    answerIds: [28614], // wrong
  },
  {
    question: {
      id: 10153,
      answers: [
        {
          id: 28616,
          isCorrect: true,
          text:
            "Correct answer -  If you are going to use a passage of Lorem Ipsum, you need to be sure there isn&#39;t anything embarrassing hidden in the middle of text",
        },
        {
          id: 28617,
          isCorrect: false,
          text:
            "Distractor option - All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",
        },
      ],
      description: "",
      title: "How can I use Lorem ipsum?",
      type: 0,
    },
    answerIds: [28616], // correct
  },
];

export default function OverviewScreen(props: IOverviewScreenProps) {
  const { appState } = useContext(AppContext);
  const [summary, setSummary] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(null);

  const {
    data: { questions },
  } = appState.formSDK;

  const getAnswerIds = (item: ISummaryItem) => {
    const { answerIds } = item;
    return item.question.answers.filter((answer) => {
      if (answerIds.includes(answer.id)) {
        return answer;
      }
    });
  };

  const isCorrectAnswer = (answerIds: number[], answers: IFormAnswerBE[]) => {
    return answerIds.every((id: number) => {
      const correctAnswers = answers.filter(
        (answer) => answer.isCorrect && answer.id === id
      );

      return (
        Boolean(correctAnswers) && correctAnswers.length === answerIds.length
      );
    });
  };

  const getSummaryItemCorrectAnswers = (item: ISummaryItem) => {
    const {
      question: { answers },
    } = item;

    return answers.filter((answer) => {
      if (answer.isCorrect) {
        return answer;
      }
    });
  };

  const getTotalCorrectAnswers = (summaryData: ISummaryItem[]) => {
    const correctAnswersArr =
      summaryData &&
      summaryData.filter((item) => {
        const {
          question: { answers },
          answerIds,
        } = item;

        if (answerIds && isCorrectAnswer(answerIds, answers)) {
          return item;
        }
      });

    console.log("totalCorrectAnswers ", correctAnswersArr);
    setCorrectAnswers(correctAnswersArr);
    return correctAnswersArr;
  };

  const getSummaryData = async () => {
    try {
      const summaryData = await appState.formSDK.getSummary();
      console.log("summaryData ", summaryData);
      // if (summaryData) {
      //   setSummary(summaryData);
      //   const correctAnswers = getTotalCorrectAnswers(summaryData);
      //   console.log("correctAnswers ", correctAnswers);
      // }

      /**
       * TODO: change to summaryData before push to production
       */
      console.log("fakeSummary ", fakeSummary);
      setSummary(fakeSummary);
      const correctAnswers = getTotalCorrectAnswers(fakeSummary);
      console.log("correctAnswers ", correctAnswers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSummaryData();
  }, []);

  return (
    summary && (
      <MasterScreen
        isAnimatedScreen
        type={ScreenType.Overview}
        header={
          <>
            <h2 className="title">
              <span className="text">Your Quiz Summary </span>
              <span className="details">
                <span className="bold">
                  {correctAnswers && correctAnswers.length}
                </span>
                /{questions.length}
              </span>
            </h2>
          </>
        }
      >
        <>
          <div className="overview-summary-list">
            <ul className="list">
              {summary.map((item: ISummaryItem, index: number) => {
                const itemCounter = `${index + 1}. `;
                return (
                  <li
                    key={`summary-item-${itemCounter}`}
                    className="summary-item"
                  >
                    <p className="summary-title">
                      <span className="counter">{itemCounter}</span>{" "}
                      {item.question.title}
                    </p>
                    <div className="summary-overview">
                      <div className="user-selection">
                        <span className="sub-title bold">Your Answers</span>
                        {getAnswerIds(item).map((answer, index) => {
                          return (
                            <div
                              key={`answer-selection-${itemCounter}-${index}`}
                              className={`answer ${
                                answer.isCorrect ? "success" : "error"
                              }`}
                            >
                              <span className="text">{answer.text}</span>
                            </div>
                          );
                        })}
                      </div>
                      {!isCorrectAnswer(
                        item.answerIds,
                        item.question.answers
                      ) && (
                        <div className="correct-answers">
                          <span className="sub-title bold">
                            Correct Answers
                          </span>
                          {getSummaryItemCorrectAnswers(item).map(
                            (answer, index) => {
                              return (
                                <div
                                  key={`correct-answer-${itemCounter}-${index}`}
                                  className="answer success"
                                >
                                  <span className="text">{answer.text}</span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      </MasterScreen>
    )
  );
}
