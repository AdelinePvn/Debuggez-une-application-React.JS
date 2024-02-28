import { Fragment, useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data, loading } = useData();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const handleKeyDown = (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      setPaused(!paused);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    let timeoutId;
    if (!paused) {
      timeoutId = setTimeout(
        () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
        5000
      );
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [paused, index]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => {
        if (!event) return null;

        return (
          <Fragment key={event.title + event.date}>
            <div
              key={event.title}
              className={`SlideCard SlideCard--${
                index === idx ? "display" : "hide"
              }`}
            >
              <img src={event.cover} alt="forum" />
              <div className="SlideCard__descriptionContainer">
                <div className="SlideCard__description">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div>{getMonth(new Date(event.date))}</div>
                </div>
              </div>
            </div>
            <div className="SlideCard__paginationContainer">
              <div className="SlideCard__pagination">
                {byDateDesc.map((date, radioIdx) => (
                  <input
                    key={data.title + date.date}
                    type="radio"
                    name="radio-button"
                    checked={index === radioIdx}
                    readOnly
                  />
                ))}
                {paused ? (
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: "&#9658;" }}
                    style={{ color: "white", marginLeft: "10px" }}
                  />
                ) : (
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: "&#10074;&#10074;" }}
                    style={{ color: "white", marginLeft: "10px" }}
                  />
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Slider;
