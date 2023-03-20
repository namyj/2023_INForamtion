import React, { useRef, useEffect, useState } from "react";
import MediaPipeWebCam from "./MediaPipeWebcam";
import { io } from "socket.io-client";
import { Tooltip } from 'react-tooltip';
import Loading from "./Loading";
import Modal from "./Modal";
import axios from 'axios';
import { useParams, useNavigate, Outlet} from 'react-router-dom'

import {
  StartButton,
  StartTriangle,
  ModalButton,
  ModalButtonContainer,
  ToolTipContent,
} from "./index.style";

export const ALPHABET_LENGTH = 26;

const modalStyle = {
  width: "600px",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "0",
};

function Learning(props) {
  //const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLearningPage, setIsLearningPage] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socketAnswer, setSocketAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({
    loadingModal: false,
    waitingAnswerModal: false,
    correctModal: false,
    wrongModal: false,
  });

  const [curSelected, setCurSelected] = useState("");

  const lazyStartTimerId = useRef(null);
  //const [isLogin] = useAtom(loginAtom);
  //const [, setUser] = useAtom(userAtom);

  const { videoId } = useParams();
  const [ Video, setVideo ] = useState([]);

 
  const handleClickButton = () => {
    setIsModalOpen((cur) => {
      return {
        ...cur,
        loadingModal: true,
      };
    });

    // 2초 후 모달창 닫음.
    lazyStartTimerId.current = setTimeout(() => {
      setCameraOn(true);
      setIsModalOpen((cur) => {
        return {
          ...cur,
          loadingModal: false,
        };
      });
    }, 2000);
  };

  // socket에서 넘어온 데이터 중에 내가 최근 선택한 값이 들어있는지 확인
  const checkAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.find((ans) => {
        return ans === curSelected.toLowerCase();
      });
    }
  };

  // socket에서 보내온 응답을 저장한다. ["a", "b", "c"]
  const handleSetSocketAnswer = (answer) => {
    setSocketAnswer(answer);
    if (checkAnswer(answer) !== undefined) {
      setIsModalOpen((cur) => {
        return {
          ...cur,
          waitingAnswerModal: false,
          correctModal: true,
        };
      });
    } else {
      setIsModalOpen((cur) => {
        return {
          ...cur,
          waitingAnswerModal: false,
          wrongModal: true,
        };
      });
    }
  };


  const handleOffMediapipe = () => {
    setCameraOn(false);
  };

  const openModal = () => {
    setIsModalOpen((cur) => {
      return {
        ...cur,
        waitingAnswerModal: true,
      };
    });
  };

  // const handleSetCurSelectedButton = (data) => {
  //   setCurSelectedButton(data);
  // };

  // const handleSetSelected = (props) => {
  //   const video_id = props.match.params.videoId;
  //   setCurSelected(video_id)
  // }

  useEffect(() => {
    try {
      //const localIsAlphabet = pathname.includes("alphabet") === true;
      //getVideos(localIsAlphabet);
      // setIsLearningPage(true);
      //   setCurSelected({
      //     word: "hi",
      //     index: 0,
      //   });

      setCurSelected(videoId)
      console.log(videoId);
    } catch (e) {
      throw new Error(e);
    }
  }, []);


  const isCameraSettingOn = () => {
    if (isLoading === false) return;
    setIsLoading(false);
  };

  const getVideos = async () => {
      console.log("videoId: ", videoId);

      axios.post('/api/video/getVideo', {
          videoId: videoId
      })
      .then((res) => {
          if (res.data.success) {
              console.log(res.data.video);
              setVideo(res.data.video);
          } else {
              alert('Failed to get video Info');
          }
      });
  };

  useEffect(() => {
    if (!videoId) {
      console.log("videoId is null");
      navigate("/learning/hi");
    } else {
      getVideos();

      return () => {
        if (lazyStartTimerId !== null) {
          clearTimeout(lazyStartTimerId.current);
        }
      };
    }
  }, [videoId]);

  return (

    <div className="learningspace">
      <>
        <Modal visible={isModalOpen.loadingModal} style={modalStyle}>
          <h3 className="text-primary fw-bold mb-5">카메라를 찾는 중···</h3>
          <img src="../../../assets/img/learning/ai_loading.png" alt="ai가 켜지길 기다리는중" width="220px" />
        </Modal>

        <Modal visible={isModalOpen.correctModal} style={modalStyle}>
          <h2 className="text-dark fw-bold mb-5">정답입니다!</h2>
          <img src="../../../assets/img/learning/correct_answer.png" alt="정답인 경우!" width="260px" />
          <ModalButtonContainer style={{marginTop:"30px"}}>
            <ModalButton
              onClick={() => {
                setIsModalOpen((cur) => {
                  return {
                    ...cur,
                    correctModal: false,
                  };
                });
                setSocketAnswer(undefined);
              }}
            >
              닫기
            </ModalButton>
            <ModalButton
              onClick={() => {
                setIsModalOpen((cur) => {
                  return {
                    ...cur,
                    correctModal: false,
                  };
                });
                setSocketAnswer(undefined);
                handleClickButton();
              }}
            >
              다시하기
            </ModalButton>
          </ModalButtonContainer>
        </Modal>

        <Modal visible={isModalOpen.wrongModal} style={modalStyle}>
          <h2 className="text-dark fw-bold mb-5">다시 한 번 해보세요.</h2>
          <img src="../../../assets/img/learning/wrong_answer.png" alt="오답인 경우!" width="260px"/>
          <ModalButtonContainer style={{marginTop:"30px"}}>
            <ModalButton
              onClick={() => {
                setIsModalOpen((cur) => {
                  return {
                    ...cur,
                    wrongModal: false,
                  };
                });
                setSocketAnswer(undefined);
              }}
            >
              닫기
            </ModalButton>
            <ModalButton
              onClick={() => {
                setIsModalOpen((cur) => {
                  return {
                    ...cur,
                    wrongModal: false,
                  };
                });
                setSocketAnswer(undefined);
                handleClickButton();
              }}
            >
              다시하기
            </ModalButton>
            </ModalButtonContainer>
        </Modal>

        <Modal visible={isModalOpen.waitingAnswerModal} style={modalStyle}>
          <h3 className="text-success fw-bold mb-5">채점 중입니다!</h3>
          {!socketAnswer && <img src="../../../assets/img/learning/grading.jpg" alt="채점중인 ai선생님" width="340px"/>}
        </Modal>
      </>

      {isLoading && <Loading />}


      <div className="contents">
        <div className="columns">
          <div className="column">
            <article className="panel">
              <p className="panel-heading">
                단어 :{Video.mean}
              </p>
              <div className="panel-block">
                  <video style={{ width: '100%' }} src={`http://localhost:4000/api/video/detail?id=${Video.fileName}`} controls></video>
              </div>
                  <p className="panel-footer" >
                    단어 :{Video.mean}</p>
                  <p className="panel-footer" >
                    수형 설명 :{Video.description}</p>
                  <p className="panel-footer">
                    출처: 국립 국어원 한국 수어 사전</p>
              </article>
          </div>
          <div className="column">
            <article className="panel" style={{ backgroundColor: "#11264f", borderRadius: "0.8rem" }}>
              <div className="panel-block-right" >
                <MediaPipeWebCam
                  cameraOn={cameraOn}
                  handleOffMediapipe={handleOffMediapipe}
                  isCameraSettingOn={isCameraSettingOn}
                  handleSetSocketAnswer={handleSetSocketAnswer}
                  openModal={openModal}
                />
                <StartButton
                  onClick={handleClickButton}
                  cameraOn={cameraOn}
                  data-tip="game-Guide"
                  data-for="game-Guide"
                >
                  <StartTriangle cameraOn={cameraOn} />
                </StartButton>

              </div>
            </article>
          </div>
        </div>
      </div>

        </div>
    )
}

export default Learning;