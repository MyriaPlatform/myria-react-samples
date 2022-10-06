type Props = {
  item: any,
  onButtonClick1: any,
  onButtonClick2?: any,
  buttonTitle1: string,
  buttonTitle2?: string,
  title: string,
  footer: string
}

const ImageCard = ({ item, onButtonClick1, onButtonClick2, buttonTitle1, buttonTitle2, title, footer }: Props) => {
  return (
    <>
      <div className="card mry-card" key={item.id} style={{ width: "14rem" }}>
        <img src={item.imageUrl ? item.imageUrl : "/null.png"} alt={item.name} className="card-img-top img-thumbnail" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{item.description}</p>
          <p className="card-link" onClick={() => onButtonClick1(item)}>{buttonTitle1}</p>
          {
            (onButtonClick2 && buttonTitle2) ? 
              <p className="card-link" onClick={() => onButtonClick2(item.id)}>{buttonTitle2}</p> :
              null
          }
        </div>
        <div className="card-footer">
          <small className="text-muted">{footer}</small>
        </div>
      </div>
    </>
  )
}

export default ImageCard;