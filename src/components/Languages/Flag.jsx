import { Us, Gb, Es, De, Fr, Pt, It, Dk, In, Pl, Ro, Nl, Se, Br } from 'react-flags-select';

// eslint-disable-next-line react/prop-types
const Flag = ({ countryCode, className }) => {
  // List of the flags and their country codes:
  // https://github.com/ekwonye-richard/react-flags-select/blob/master/src/data/countries.ts
  return (
    <>
      {countryCode === 'US' && <Us className={className} />}
      {countryCode === 'GB' && <Gb className={className} />}
      {countryCode === 'ES' && <Es className={className} />}
      {countryCode === 'DE' && <De className={className} />}
      {countryCode === 'FR' && <Fr className={className} />}
      {countryCode === 'PT' && <Pt className={className} />}
      {countryCode === 'IT' && <It className={className} />}
      {countryCode === 'DK' && <Dk className={className} />}
      {countryCode === 'IN' && <In className={className} />}
      {countryCode === 'PL' && <Pl className={className} />}
      {countryCode === 'RO' && <Ro className={className} />}
      {countryCode === 'NL' && <Nl className={className} />}
      {countryCode === 'SE' && <Se className={className} />}
      {countryCode === 'BR' && <Br className={className} />}
    </>
  );
};

export default Flag;
