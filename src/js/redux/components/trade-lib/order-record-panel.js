import React, {Component} from 'react';
import { Tab, Table, Button} from 'semantic-ui-react';

const tmpRecord = [
  {id: 1, time: '11:12:12', type: 'in', price: 8909.90, count: 8981.23, dealed: 23.45, undeal: 46.78, total: 0.56},
  {id: 2, time: '11:12:12', type: 'in', price: 8909.90, count: 8981.23, dealed: 23.45, undeal: 46.78, total: 0.56},
  {id: 3, time: '11:12:12', type: 'in', price: 8909.90, count: 8981.23, dealed: 23.45, undeal: 46.78, total: 0.56},
]

const OrderRecordPanel = (props) => {
  return () => <Tab.Pane attached={false} className="fl-trade-panel" style={{padding: '0px', marginTop: '0px'}}>
          <Table basic="very" textAlign="center" className="no-border-table gray-header-table" style={{margin: '0px'}}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell verticalAlign="top">时间</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">类型</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">委托价(USDT)</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">委托量(USDT)</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">成交量(BTC)</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">尚未成交(BTC)</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">合计</Table.HeaderCell>
                <Table.HeaderCell verticalAlign="top">操作</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                tmpRecord.map( m => {
                  return (<Table.Row key={m.id + '-tmp-record'}>
                <Table.Cell>{m.time}</Table.Cell>
                <Table.Cell>
                  { m.type == 'in' ? <span className="color-up">买</span> : <span className="color-down">卖</span>}
                </Table.Cell>
                <Table.Cell>
                  { m.type == 'in' ? <span className="color-up">{m.price}</span> : <span className="color-down">{m.price}</span>}
                </Table.Cell>
                <Table.Cell>{m.count}</Table.Cell>
                <Table.Cell>{m.dealed}</Table.Cell>
                <Table.Cell>{m.undeal}</Table.Cell>
                <Table.Cell>{m.total}</Table.Cell>
                <Table.Cell><Button size="small">撤销</Button></Table.Cell>
              </Table.Row>)
                })
              }
            </Table.Body>
          </Table>
      </Tab.Pane>
}

export default class OrderRecordPanelWrapper extends Component{
  render(){
    var { props } = this;
    const PanelInner= [
      { menuItem: '当前委托', render: OrderRecordPanel( { ...props, panel_type: 'current'} ) },
      { menuItem: '交易记录', render: OrderRecordPanel( { ...props, panel_type: 'before'} ) }
    ]
    return(
      <Tab className="order-record" menu={{ secondary: true, pointing: true }} panes={ PanelInner } style={{marginBottom: '0px'}} />
      )
  }
}