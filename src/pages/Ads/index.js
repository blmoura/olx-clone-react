import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/MainComponents';
import AdItem from '../../components/partials/AdItem';

import { useLocation, useHistory } from 'react-router-dom';

import useApi from '../../helpers/OlxAPI';

import { PageArea } from './styles';

let timer;

function Ads() {
  const api = useApi();
  const history = useHistory();

  const useQueryString = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQueryString();

  const [q, setQ] = useState(query.get('q') !== null ? query.get('q') : '');
  const [cat, setCat] = useState(
    query.get('cat') !== null ? query.get('cat') : '',
  );
  const [state, setState] = useState(
    query.get('state') !== null ? query.get('state') : '',
  );

  const [adsTotal, setAdsTotal] = useState(0);

  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adList, setAdList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [resultOpacity, setResultOpacity] = useState(1);
  const [loading, setLoading] = useState(true);

  const getAdsList = async () => {
    setLoading(true);
    let offset = (currentPage - 1) * 9;

    const json = await api.getAds({
      sort: 'desc',
      limit: 9,
      q,
      cat,
      state,
      offset,
    });

    setAdList(json.ads);
    setAdsTotal(json.total);
    setResultOpacity(1);
    setLoading(false);
  };

  useEffect(() => {
    if (adList.length > 0) {
      setPageCount(Math.ceil(adsTotal / adList.length));
    } else {
      setPageCount(0);
    }
  }, [adsTotal]);

  useEffect(() => {
    setResultOpacity(0.3);
    getAdsList();
  }, [currentPage]);

  useEffect(() => {
    let queryString = [];
    if (q) {
      queryString.push(`q=${q}`);
    }
    if (cat) {
      queryString.push(`cat=${cat}`);
    }
    if (state) {
      queryString.push(`state=${state}`);
    }

    history.replace({
      search: `?${queryString.join('&')}`,
    });

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(getAdsList, 2000);
    setResultOpacity(0.3);
    setCurrentPage(1);
  }, [q, cat, state]);

  useEffect(() => {
    const getCategories = async () => {
      const cats = await api.getCategories();
      setCategories(cats);
    };
    getCategories();
  }, [api]);

  useEffect(() => {
    const getStates = async () => {
      const slist = await api.getStates();
      setStateList(slist);
    };
    getStates();
  }, [api]);

  let pagination = [];
  for (let i = 0; i < pageCount; i++) {
    pagination.push(i + 1);
  }

  return (
    <PageContainer>
      <PageArea>
        <div className="leftSide">
          <form method="get">
            <input
              type="text"
              name="q"
              placeholder="O que você procura?"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <div className="filterName">Estado:</div>
            <select
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value=""></option>
              {stateList &&
                stateList.map((item, key) => (
                  <option key={key} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>

            <div className="filterName">Categoria:</div>
            <ul>
              {categories &&
                categories.map((item, key) => (
                  <li
                    key={key}
                    className={
                      cat === item.slug ? 'categoryItem active' : 'categoryItem'
                    }
                    onClick={() => setCat(item.slug)}
                  >
                    <img src={item.img} alt={item.name} />
                    <span>{item.name}</span>
                  </li>
                ))}
            </ul>
          </form>
        </div>
        <div className="rightSide">
          <h2>Resultados</h2>
          {loading && adList.length === 0 && (
            <div className="listWarning">Carregando...</div>
          )}
          {!loading && adList.length === 0 && (
            <div className="listWarning">Não encontramos resultados.</div>
          )}
          <div className="list" style={{ opacity: resultOpacity }}>
            {adList.map((item, key) => (
              <AdItem key={key} data={item} />
            ))}
          </div>

          <div className="pagination">
            {pagination.map((item, key) => (
              <div
                onClick={() => setCurrentPage(item)}
                className={
                  item === currentPage ? 'pageItem active' : 'pageItem'
                }
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </PageArea>
    </PageContainer>
  );
}
export default Ads;
