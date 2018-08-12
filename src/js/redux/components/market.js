import React, {Component} from 'react';
import { Button, Table, Select, Dropdown, Icon, Pagination, Input }  from 'semantic-ui-react';

import RadioGroup from './common/radio-group';
import RadioButton from './common/radio-button';



export default class Market extends Component{
  render(){
    const options = [{ key: 1, text: '市值', value: 1 }, { key: 2, text: 'Choice 2', value: 2 }]
    return (
      <div>
        <div className="fl-block" style={{height: '200px'}}>

        </div>
        <div style={{background: '#00Bfff'}}>
          <p style={{textAlign: 'center', color: '#fff', padding: '10px 0px'}}>5月热门数字币投资分析</p>
        </div>
        <div className="fl-block  reverse-fl-block" style={{padding: '20px 100px'}}>
          <div className="coin-market-wrapper">
            <div className="item item-4"><Button className="default-btn-simple">币圈小常识</Button></div>
            <div className="item item-4"><Button className="default-btn-simple">投资分析</Button></div>
            <div className="item item-4"><Button className="default-btn-simple">排行榜</Button></div>
            <div className="item item-4"><Button className="default-btn-simple">币圈动态</Button></div>
          </div>
        </div>
        <div className="fl-block reverse-fl-block">
          <div className="header-container">
            <div className="item-3"></div>
            <div className="item-3">
              <RadioGroup>
                <RadioButton label="我的收藏"></RadioButton>
                <RadioButton label="全部币种"></RadioButton>
              </RadioGroup>
            </div>
            <div className="item-3">
              <Input size="small" icon='search' placeholder='输入想查找的币种' style={{float: 'right'}} />
            </div>
          </div>
          <div className="filter">
            <div className="fl-form-item">
              <label>排序维度</label>
              <Dropdown text='市值' options={options} />
            </div>
            <div className="fl-form-item">
              <label>排序方式</label>
              <Dropdown text="从高到低" options={options} />
            </div>
            <div className="fl-form-item">
              <label>支付方式</label>
              <Dropdown text="支付宝" options = {options} />
            </div>
          </div>
          <div className="table-container">
            <Table basic className="market-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>排名</Table.HeaderCell>
                  <Table.HeaderCell>名称</Table.HeaderCell>
                  <Table.HeaderCell>最新价（元）</Table.HeaderCell>
                  <Table.HeaderCell>24h涨跌幅</Table.HeaderCell>
                  <Table.HeaderCell>日最高价（元）</Table.HeaderCell>
                  <Table.HeaderCell>日最低价（元）</Table.HeaderCell>
                  <Table.HeaderCell>成交量（RMB）</Table.HeaderCell>
                  <Table.HeaderCell>支付方式</Table.HeaderCell>
                  <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><Icon name="star outline"/></Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>BTC比特币</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>+4.5%</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>234566</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Icon name="star outline"/></Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>BTC比特币</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>+4.5%</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>234566</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Icon name="star outline"/></Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>BTC比特币</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>+4.5%</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>234566</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
              </Table.Body>
            </Table>
            <Pagination size="mini" defaultActivePage={5} totalPages={10} style={{marginTop: '10px'}} />

          </div>
        </div>
      </div>
      )
  }
}