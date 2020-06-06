import React, { useState, useMemo, useEffect, memo, useCallback } from 'react'
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './CitySelector.css'



const CitySelector = memo(function CitySelector(props) {
  const { show, onBack, cityData, isLoading, fetchCityData, select } = props
  const [searchKey, setSearchKey] = useState('')

  // 一个useMemo优化
  const key = useMemo(() => searchKey.trim(), [searchKey]);

  useEffect(() => {
    if (!show || cityData || isLoading) {
      return
    }
    fetchCityData()
  }, [show, cityData, isLoading])

  // Element.scrollIntoView() 方法让当前的元素滚动到浏览器窗口的可视区域内。
  const AlphabetClick = useCallback((val) => {
    document.querySelector(`[data-key='${val}']`).scrollIntoView()
  }, [])

  // 城市选择框
  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading....</div>
    }
    if (cityData) {
      return (
        <CityList secionts={cityData.cityList} select={select} AlphabetClick={AlphabetClick} />
      )
    }
  }

  return (
    <div
      className={classnames('city-selector', { hidden: !show })}
    >
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            className="search-input"
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="城市、车站的中文或拼音"
          />
        </div>
        <i
          // className={['search-clean',(!searchKey.length) && 'hiddle'].filter(Boolean).join('')}
          className={classnames('search-clean', {
            hidden: key.length === 0,
          })}
          onClick={() => setSearchKey('')}
        >
          &#xf063;
      </i>
      </div>
      {Boolean(key) && <Suggest select={select} searchKey={key} setSearchKey={setSearchKey} />}
      {outputCitySections()}
    </div>
  )
})

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  fetchCityData: PropTypes.func.isRequired
}

export default CitySelector;

/**子组件************************************************* 子组件*/

// 转换为英文字母
const Alphabet = Array.from(new Array(26), (ele, i) => {
  return String.fromCharCode(65 + i)
})

// list拆解 key唯一
const CityList = memo(function CityList(props) {
  const { secionts, select, AlphabetClick } = props
  return (
    <div className="city-list">
      <div className="city-cate">
        {secionts.map(ele => {
          return <CitySection key={ele.title} title={ele.title} citys={ele.citys} select={select} />
        })}
      </div>
      <div className="city-index">
        {Alphabet.map(ele => {
          return <AlphaIndex alpha={ele} key={ele} AlphabetClick={AlphabetClick} />
        })}
      </div>
    </div>
  )
})

CityList.propTypes = {
  AlphabetClick: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  secionts: PropTypes.array,
}

const CitySection = memo(function CitySection(props) {
  const { title, citys = [], select } = props
  return (
    <ul className="city-ul">
      <li className="city-li" data-key={title}>{title}</li>
      {citys.map(ele => {
        return <CityItem name={ele.name} key={ele.name} select={select} />
      })}
    </ul>
  )
})

CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
  citys: PropTypes.array,
}

const CityItem = memo(function CityItem(props) {
  const { name, select } = props
  return (
    <li className="city-li" onClick={() => select(name)}>{name}</li>
  )
})

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
};

// 右侧字母
const AlphaIndex = memo(function AlphaIndex(props) {
  const { alpha, AlphabetClick } = props
  return (
    <i className="city-index-item" onClick={() => AlphabetClick(alpha)}>{alpha}</i>
  )
})

AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  AlphabetClick: PropTypes.func.isRequired,
};

// -------------------搜索-------------------

const Suggest = memo(function Suggest(props) {
  const { searchKey, select, setSearchKey } = props;

  const [result, setResult] = useState([]);

  useEffect(() => {
    fetch('/rest/search?key=' + encodeURIComponent(searchKey))
      .then(res => res.json())
      .then(data => {
        const { result, searchKey: sKey } = data;

        if (sKey === searchKey) {
          setResult(result);
        }
      });
  }, [searchKey]);

  const fallBackResult = useMemo(() => {
    // 为空返回自定义的数据
    if (!result.length) {
      return [
        {
          display: searchKey,
        },
      ];
    }

    return result;
  }, [result, searchKey]);

  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {fallBackResult.map(item => {
          return (
            <SuggestItem
              key={item.display}
              name={item.display}
              select={select}
              setSearchKey={setSearchKey}
            />
          );
        })}
      </ul>
    </div>
  );
});

Suggest.propTypes = {
  searchKey: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
};

const SuggestItem = memo(function SuggestItem(props) {
  const { name, select, setSearchKey } = props;

  const searchVal = useCallback(() => {
    select(name)
    setSearchKey('')
  }, [name])

  return (
    <li className="city-suggest-li" onClick={searchVal}>
      {name}
    </li>
  );
});

SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
};
