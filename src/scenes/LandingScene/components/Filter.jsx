import React from 'react'
import imgX from 'src/styles/img/x-white.png'
import FilterDropdownTree from './FilterDropdownTree'
import arrayUnion from 'lodash/union'
import DropdownTreeSelect from 'react-dropdown-tree-select';
import DataUpdateInfo from './DataUpdateInfo';
import { IconSearch, IconGlobe } from 'src/components/Icon';

class Filter extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      availabilityOptions: props.availabilityOptions,
      geoVal: [],
      searchVal: props.searchVal,
      availabilityVal: (props.availabilityOptions.filter(i=>i.checked === true)).map(i=>i.value)
    }
  }

  setFilterData = value => {
    if (value.geoVal.length === 0) {
      value.availabilityVal = this.state.availabilityOptions.map(i=>i.value)
    }

    value.availabilityOptions = value.availabilityOptions
      .map(i=> {
        i.disabled = value.geoVal.length === 0
        i.tagClassName = i.tagClassName.replace('disabled','')+(value.geoVal.length === 0 ? ' disabled' : '')
        i.checked = value.geoVal.length === 0 || value.availabilityVal.indexOf(i.value) >= 0
        return i
      })

    this.setState(value)
    this.props.onFilterChange(value)
  }

  clearSearchField = () => {
    let newFilterData = {...this.state, searchVal: null}
    this.setFilterData(newFilterData)
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.name === 'servicesOnlyWithIO' ? target.checked : target.value;
    const name = target.name;

    let newFilterData = {...this.state, [name]: value}
    this.setFilterData(newFilterData)
  }

  handleRegionSelectChange = (currentNode, selectedNodes) => {
    let newFilterData = {...this.state, geoVal: arrayUnion(...selectedNodes.map(i=>i.value))}
    this.setFilterData(newFilterData)
  }

  handleRegionAvailabilitySelectChange = (currentNode, selectedNodes) => {
    let newFilterData = {...this.state}
    if (this.state.geoVal.length > 0) {
      newFilterData.availabilityVal = selectedNodes.map(i=>i.value)
    }
    this.setFilterData(newFilterData)
  }

  render(){
    return (
      <div className="container periodic-table-filter">
        <div className="row">
          <div className="col-4">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text"><IconSearch/></span>
              </div>

              <input
                className={`form-control search-input`}
                type="text" placeholder="Search" aria-label="Search"
                value={this.state.searchVal || ''}
                name="searchVal"
                onChange={this.handleInputChange}
                onKeyDown={ e => {
                  if (e.keyCode === 27) {
                    this.clearSearchField()
                  }
                }}
                />

              {
                this.state.searchVal
                ? <div className="input-group-append clear-search-x"
                    onClick={()=>this.clearSearchField()}
                    >
                    <div className="input-group-text">
                      <img src={imgX} width="10px"/>
                    </div>
                  </div>
                : ''
              }
            </div>

            <div className="input-group" style={{marginTop: '5px'}}>
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <input
                    type="checkbox"
                    name="servicesOnlyWithIO"
                    onChange={this.handleInputChange}
                  />
                </span>
              </div>
              <div  style={{marginTop: '3px'}}>
                <span className="text-muted">Show services with In/Out connections only</span>
              </div>
            </div>

          </div>
          <div className="col-4 clearfix">
            <div className="periodic-table-geo-filter">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"><IconGlobe/></span>
                </div>
                <div className="periodic-table-geo-regions-wrapper">
                  <FilterDropdownTree
                    data={this.props.regionsSource}
                    onChange={this.handleRegionSelectChange}
                    showPartiallySelected={true}
                    texts={{ placeholder: 'Filter by region...' }}
                  />
                </div>
              </div>
              <div className="periodic-table-geo-regions-availability-wrapper">
                <DropdownTreeSelect
                  className="availability-dropdown"
                  data={this.state.availabilityOptions}
                  onChange={this.handleRegionAvailabilitySelectChange}
                  texts={{ placeholder: 'Region availability...' }}
                />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="float-right">
              <DataUpdateInfo
                lastConnectionsUpdate={this.props.lastConnectionsUpdate}
                lastAvailabilityUpdate={this.props.lastAvailabilityUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}



Filter.defaultProps = {
  searchVal: '',
  regionsSource: [],
  availabilityOptions: []
}

export default Filter