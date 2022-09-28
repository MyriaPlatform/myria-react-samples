type Props = {
  item: any,
  onButtonClick1: any,
  buttonTitle1: string,
  title: string,
  body: any,
  footer: string
}

const TextCard = ({ item, onButtonClick1, buttonTitle1, title, body, footer }: Props) => {
  return (
    <>
      <div className="card mry-card" key={item.id} style={{ width: "14rem" }}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{body}</p>
          {
            (onButtonClick1) ? 
              <p className="card-link" onClick={() => onButtonClick1(item.id)}>{buttonTitle1}</p> :
              ""
          }
        </div>
        <div className="card-footer">
          <small className="text-muted">{footer}</small>
        </div>
      </div>
    </>
  )
}

export default TextCard;