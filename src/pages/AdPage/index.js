import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../../components/MainComponents';
import { Slide } from 'react-slideshow-image';

import useApi from '../../helpers/OlxAPI';

import { PageArea, Fake, OthersArea, BreadCrumb } from './styles';
import AdItem from '../../components/partials/AdItem';

function AdPage() {
  const api = useApi();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [adInfo, setAdInfo] = useState({});

  useEffect(() => {
    const getAdInfo = async (key) => {
      const json = await api.getAd(key, true);
      setAdInfo(json);
      setLoading(false);
    };
    getAdInfo(id);
  }, []);

  function formatDate(date) {
    let cDate = new Date(date);
    let months = [
      'Janeiro',
      'Feveiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    let cDay = cDate.getDate();
    let cMonth = cDate.getMonth();
    let cYear = cDate.getFullYear();

    return `${cDay} de ${months[cMonth]} de ${cYear}`;
  }

  return (
    <PageContainer>
      <BreadCrumb>
        Você está aqui:
        <Link to="/">Home</Link>/
        <Link to={`/ads?state=${adInfo.stateName}`}>{adInfo.stateName}</Link>/
        <Link
          to={`/ads?state=${adInfo.stateName}&cat=${adInfo.category?.slug}`}
        >
          {adInfo.category?.name}
        </Link>
        / {adInfo.title}
      </BreadCrumb>

      <PageArea>
        <div className="leftSide">
          <div className="box">
            <div className="adImage">
              {loading && <Fake height={300} />}
              {adInfo.images && (
                <Slide>
                  {adInfo.images.map((img, k) => (
                    <div key={k} className="each-slide">
                      <img src={img} alt="Slider Image" />
                    </div>
                  ))}
                </Slide>
              )}
            </div>
            <div className="adInformation">
              <div className="adName">
                {loading && <Fake height={20} />}
                {adInfo.title && <h2>{adInfo.title}</h2>}
                {adInfo.dateCreated && (
                  <small>Criado em {formatDate(adInfo.dateCreated)}</small>
                )}
              </div>
              <div className="adDescription">
                {loading && <Fake height={100} />}
                {adInfo.description}
                <hr />
                {adInfo.views && <small>Visualizações : {adInfo.views}</small>}
              </div>
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="box box--pading">
            {loading && <Fake height={20} />}
            {adInfo.priceNegotiable && 'Preço Negociável'}
            {!adInfo.priceNegotiable && adInfo.price && (
              <div className="price">
                Preço: <span>R$ {adInfo.price}</span>
              </div>
            )}
          </div>
          {loading && <Fake height={50} />}
          {adInfo.userInfo && (
            <>
              <a
                href={`mailTo:${adInfo.userInfo.email}`}
                target="_blank"
                className="contactSellerLink"
              >
                Fale com o vendedor
              </a>
              <div className="createdBy box box--pading">
                <strong>{adInfo.userInfo.name}</strong>
                <small>Email: {adInfo.userInfo.email}</small>
                <small>Estado: {adInfo.stateName}</small>
              </div>
            </>
          )}
        </div>
      </PageArea>
      <OthersArea>
        {adInfo.others && (
          <>
            <h2>Outras ofertas do vendedor</h2>
            <div className="list">
              {adInfo.others.map((item, key) => (
                <AdItem key={key} data={item} />
              ))}
            </div>
          </>
        )}
      </OthersArea>
    </PageContainer>
  );
}
export default AdPage;
