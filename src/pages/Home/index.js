import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/MainComponents';
import AdItem from '../../components/partials/AdItem';

import { Link } from 'react-router-dom';

import useApi from '../../helpers/OlxAPI';

import { PageArea, SearchArea } from './styles';

function Home() {
  const api = useApi();

  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adList, setAdList] = useState([]);

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

  useEffect(() => {
    const getRecentAds = async () => {
      const json = await api.getAds({
        sort: 'desc',
        limit: 8,
      });

      setAdList(json.ads);
    };
    getRecentAds();
  }, [api]);

  return (
    <>
      <SearchArea>
        <PageContainer>
          <div className="searchBox">
            <form method="get" action="/ads">
              <input type="text" name="q" placeholder="O que você procura?" />
              <select name="state">
                {stateList.map((item, key) => (
                  <option key={key} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button>Pesquisar</button>
            </form>
          </div>
          <div className="categoryList">
            {categories.map((item, key) => (
              <Link
                key={key}
                to={`/ads?cat=${item.slug}`}
                className="categoryItem"
              >
                <img src={item.img} alt="" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </SearchArea>
      <PageContainer>
        <PageArea>
          <h2>Anúncios Recentes</h2>
          <div className="list">
            {adList.map((item, key) => (
              <AdItem key={key} data={item} />
            ))}
          </div>
          <Link to="/ads" className="seeAllLink">
            Ver todos
          </Link>
          <hr />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            quam incidunt nesciunt laborum molestiae doloribus quisquam quod
            exercitationem fugit corporis hic aut perspiciatis, dolorem
            accusantium inventore magni debitis illum. Quisquam.
          </p>
        </PageArea>
      </PageContainer>
    </>
  );
}
export default Home;
