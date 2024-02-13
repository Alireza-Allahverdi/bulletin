import { Icon } from "@iconify/react"

function InfoCard({ data, titleText, isEdit, isObject, isArray, clicked, onChangeHandler, other }) {
  return (
    <div
      className='cardContainer'
      style={{
        backgroundColor: "#fff",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)"
      }}
    >
      <div className="infoCardTitleContainer">
        <div className="title">
          <p>
            {
              titleText === "University" ?
                <Icon icon="mdi:university-outline" />
                :
                titleText === "Work" ?
                  <Icon icon="ic:baseline-work-outline" />
                  :
                  titleText === "Personal Info" ?
                    <Icon icon="icomoon-free:profile" />
                    :
                    titleText === "Insterests" ?
                      <Icon icon="material-symbols:interests-outline-rounded" />
                      :
                      titleText === "Skills" ?
                        <Icon icon="mdi:head-cog-outline" />
                        :
                        titleText === "Hobbies" ?
                          <Icon icon="streamline:entertainment-party-popper-hobby-entertainment-party-popper-confetti-event" />
                          :
                          null
            }
            {titleText}
          </p>
        </div>
      </div>
      <div className="infoCardContent" style={{ color: isEdit || other ? "gray" : "" }}>
        {
          isEdit && !isArray && !isObject && clicked
            ? <input type="text" value={data} className="infoCardEditInput" onChange={onChangeHandler} />
            : isEdit && !isArray && !isObject && !clicked
              ? data
              : null
        }
        {
          !isObject && !isArray && !isEdit
            ? data
            : null
        }
        {
          isObject
            ? <div className="persoanInfoContainer">
              <p>Age: {isEdit && clicked && isObject && !isArray ? <input name='age' type="number" value={data?.age} onChange={onChangeHandler} /> : data?.age}</p>
              <p>Relationship: {isEdit && clicked && isObject && !isArray ? <input name='relationship' type="text" value={data?.relationship} onChange={onChangeHandler} /> : data?.relationship}</p>
              <p>Gender: {isEdit && clicked && isObject && !isArray ? <input name='gender' type="text" value={data?.gender} onChange={onChangeHandler} /> : data?.gender}</p>
            </div>
            : null
        }
        {
          isArray && data && data.length !== 0
            ?
            <div>
              {
                data.map((item, index) => {
                  return <p key={index}>{item}</p>
                })
              }
            </div>
            : null
        }
      </div>
    </div>
  )
}


export default InfoCard