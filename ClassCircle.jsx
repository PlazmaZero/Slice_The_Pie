
// Circle constrctor, to make the pie chart
class MyInput extends Component {
  constructor() {
    super();
    this.state = {value: ""};
  }

  update = (e) => {
    this.setState({value: e.target.value});
  }

  render() {
    return (
      <input onChange={this.update} value={this.state.value} />
    );
  }
}