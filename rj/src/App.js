import React from 'react'
const PRODUCTS = [
  {
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football",
  },
  {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball",
  },
  {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball",
  },
  {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch",
  },
  {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5",
  },
  { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" },
];

class SearchBar extends React.Component {
  handleFilterTextChange = (e) => {
    this.props.handleFilterTextChange(e.target.value)
  }
  handleInStockChange = e => {
    this.props.handleInStockChange(e.target.checked)
  }
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." onChange={this.handleFilterTextChange} />
        <p>
          <input type="checkbox" id="check" checked={this.props.hasStock} onChange={this.handleInStockChange} />
          <label htmlFor="check">仅显示有库存的商品</label>
        </p>
      </form>
    )
  }
}
class ProductCateRow extends React.Component {
  render() {
    return (
      <tr>
        <th colSpan="2">{this.props.cate}</th>
     </tr>
    )
  }
}
class ProductRow extends React.Component {
  render() {
    const {name, price, stocked} = this.props
    const noStockName = stocked
      ? name 
      : <span style={{color: 'red'}}>{name}</span>
    return (
      <tr>
      <td>{noStockName}</td>
      <td>{price}</td>
     </tr>
    )
  }
}
class ProductTable extends React.Component {
  render() {
    const {products, filterText, hasStock} = this.props
    const rows = []
    let crtCate = null
    products.forEach(product => {
      if (product.name.indexOf(filterText) === -1) return 
      if (!product.stocked && hasStock) return 
      console.log('1111', 1111, hasStock)
      if (product.category !== crtCate ) rows.push(<ProductCateRow cate={product.category} key={product.category} />)
      rows.push(<ProductRow key={product.name} {...product} />) 
      crtCate = product.category
    })
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

class FilterableProductTable extends React.Component {
  state = {
    filterText: '',
    hasStock: true
  }
  handleFilterTextChange = (searchValue) => {
    this.setState({
      filterText: searchValue
    })
  }
  handleInStockChange = (hasStock) => {
    this.setState({
      hasStock
    })
  }
  render() {
    return (
      <>
        <SearchBar handleFilterTextChange={this.handleFilterTextChange} handleInStockChange={this.handleInStockChange} hasStock={this.state.hasStock}/>
        <ProductTable products={this.props.products} filterText={this.state.filterText} hasStock={this.state.hasStock}/>
      </>
    )
  }
}

class App extends React.Component {
  render() {
    return <FilterableProductTable products={PRODUCTS}/>
  }
}


export default App