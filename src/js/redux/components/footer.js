import React, {Component} from 'react';
import {Link} from 'react-router';
import { Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import * as LangActions from 'actions/lang.js';
import { bindActionCreators } from 'redux';
import { footer } from 'locales/index';

class Footer extends Component{
  constructor(props){
    super(props);
    this.state = {
      initDone: false,
    }
  }
  componentDidMount() {
    this.loadLocales(this.props.Lang.lang);
  }
  loadLocales(lang){
    /*intl.init({
      currentLocale: lang || 'en-US',
      locales:footer
    })
    .then( () => {
      this.setState({ initDone: true })
    })*/
    intl.load(footer)
    this.setState({initDone: true})
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  render(){
    var { initDone } = this.state;
    return(
       <div className="footer">
        {/*{ initDone && <div className="doc_root_wrap">
          <dl>
            <dt>海洋数字交易feilian</dt>
            <dd>The Global Coin Exchange</dd>
            <dd className="icons"></dd>
          </dl>
          <dl>
            <dt><h2>{intl.get('about')}</h2></dt>
            <dd><Link to="">{intl.get('about_us')}</Link></dd>
            <dd><Link to="">{intl.get('team_introduce')}</Link></dd>
            <dd><Link to="">{intl.get('fees')}</Link></dd>
          </dl>
          <dl>
            <dt><h2>{intl.get('support')}</h2></dt>
            <dd><Link to="">{intl.get('disclaimer_clause')}</Link></dd>
            <dd><Link to="">{intl.get('privacy_policy')}</Link></dd>
            <dd><Link to="">{intl.get('terms_of_user')}</Link></dd>
          </dl>
          <dl>
            <dt><h2>{intl.get('declaration')}</h2></dt>
            <dd><Link to="">{intl.get('announcement')}</Link></dd>
            <dd><Link to="">{intl.get('apply_to_list')}</Link></dd>
            <dd><Link to="">{intl.get('help')}</Link></dd>
          </dl>
        </div>}
        <Divider className="footer-divider" />*/}
        <div className="year-last">© {intl.get('companyname')} All Rights Reserved.</div>
      </div>
      )
  }
}
function mapStateToProps(state){
  return state.LoginData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...LangActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);