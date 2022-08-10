import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';

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
        }
    }).then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // 注意：需要在此处处理错误
        // 而不是使用 catch() 去捕获错误
        // 因为使用 catch 去捕获异常会掩盖掉组件本身可能产生的 bug
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
          return <div>Loading...</div>;
        } else {
            return (
              <div className="container">
                <div className={clsx('col col--8')}>
                  {items.map(item => (
                    <div>
                      <h4>{item.updated_at}</h4>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
        }
    }
}

export default SentenceComp;
