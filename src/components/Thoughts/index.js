import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import parse from 'html-react-parser';

function isoToString(date) {
  var timezone = -date.getTimezoneOffset(),
      dif = timezone >= 0 ? '+' : '-',
      pad = function(num) {
          return (num < 10 ? '0' : '') + num;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      ' ' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) + ' '
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
}

class SentenceComp extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        items: []
      };
    }
    
    componentDidMount() {
    fetch("https://api.github.com/repos/anchem/anchem.github.io/issues/7/comments", {
        headers: {
            'Accept': 'application/vnd.github.full+json'
            // 'Authorization': `token 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`
        }
    }).then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.sort((a, b) => b.updated_at > a.updated_at ? 1 : -1)
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
    
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <h2>加载中 | Loading...</h2>;
        } else {
            return (
              <div className="container">
                <div className={clsx('col col--8')}>
                  {items.map(item => (
                    <div>
                      <h4>{isoToString(item.updated_at)}</h4>
                      {parse(item.body_html)}
                    </div>
                  ))}
                </div>
              </div>
            );
        }
    }
}

export default SentenceComp;
