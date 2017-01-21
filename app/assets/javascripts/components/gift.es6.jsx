var Gift = React.createClass({

  getInitialState() {
    return { giftData: { name: '', price: '', link: '' }, editable: this.props.editable, errors: [] }
  },

  componentDidMount() {
    this.setState({ giftData: { name: this.props.name, price: this.props.price, link: this.props.link }})
  },

  toggleEditable() {
    this.setState({ editable: !this.state.editable })
  },

  onChange(event) {
    const field = event.target.name;
    const giftData = this.state.giftData;
    giftData[field] = event.target.value;
    return this.setState({giftData: giftData});
  },

  handleEdit() {
    var name = this.state.giftData.name
    var price = this.state.giftData.price
    var link = this.state.giftData.link
    var id = this.props.giftId
    var gift = { name: name, price: price, link: link, id: id}
    $.ajax({
      url: `/api/v1/gifts/${gift.id}`,
      type: 'PUT',
      data: { gift: gift },
      success: (gift) => {
        this.setState({ giftData: { name: gift.name, price: gift.price, link: gift.link }, errors: [] })
        this.toggleEditable();
      },
      error: (xhr) => {
        var errors = JSON.parse(xhr.responseText).errors
        this.setState({ errors: errors })
      }
    })
  },

  handleDelete() {
    var id = this.props.giftId
    $.ajax({
      url: `/api/v1/gifts/${id}`,
      type: 'DELETE',
      success: (gift) => {
        this.props.handleDeleteGift(id);
      }
    })
  },

  render () {
    if(this.state.editable) {
      return (
        <tr>
            <td>
              <TextInput
                name="name"
                type="text"
                value={this.state.giftData.name}
                onChange={this.onChange}/>
            </td>
            <td>
              <TextInput
                name="price"
                type="text"
                value={this.state.giftData.price ? this.state.giftData.price.toString() : ''}
                onChange={this.onChange}/>
            </td>
            <td>
              <TextInput
                name="link"
                type="text"
                value={this.state.giftData.link}
                onChange={this.onChange}/>
            </td>
            <td>
              <button onClick={this.handleEdit}>Update</button>
            </td>
            <td>
              <button onClick={this.handleDelete}>Delete</button>
            </td>
            <td>
            <ul>
            {this.state.errors.map((error, index) => {
              return <li style={{color: "red"}} key={index}>{error}</li>
            })}
            </ul>
            </td>
        </tr>
      );
    }
    else {
      return (
        <tr>
          <td>{this.state.giftData.name}</td>
          <td>{this.state.giftData.price}</td>
          <td>{this.state.giftData.link}</td>
          <td><button onClick={this.toggleEditable}>Edit</button></td>
        </tr>
      )
    }
  }
})

Gift.propTypes = {
  name: React.PropTypes.string,
  link: React.PropTypes.string,
  price: React.PropTypes.number,
  populated: React.PropTypes.bool,
  giftId: React.PropTypes.number,
  handleDeleteGift: React.PropTypes.func
};
