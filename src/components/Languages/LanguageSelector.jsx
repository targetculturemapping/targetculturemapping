/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import ReactFlagsSelect from 'react-flags-select';
import LanguagesList from 'components/Languages/LanguagesList';

// eslint-disable-next-line react/prop-types
const LanguageSelector = ({ onLanguageChange, languages, defaultLanguage }) => {
  const [selectedCountry, setSelectedCountry] = useState('');

  const getCountryCodeForLanguage = languageCode => {
    const language = LanguagesList.find(l => l.languageCode === languageCode);
    return language.countryCode;
  };

  useEffect(() => {
    if (defaultLanguage !== undefined && selectedCountry === '') {
      setSelectedCountry(getCountryCodeForLanguage(defaultLanguage));
    }
  }, [defaultLanguage, selectedCountry, setSelectedCountry]);

  const getCountryCodeArray = () => {
    // eslint-disable-next-line react/prop-types
    const languagesFromList = LanguagesList.filter(l => languages.includes(l.languageCode));

    return languagesFromList?.map(l => l.countryCode);
  };

  const getCustomLabels = () => {
    const languagesFromList = LanguagesList.filter(l => languages.includes(l.languageCode));

    const customLabels = {};

    for (let i = 0; i < languagesFromList.length; i += 1) {
      customLabels[languagesFromList[i].countryCode] = languagesFromList[i].language;
    }

    return customLabels;
  };

  const getLanguageCodeForCountry = countryCode => {
    const language = LanguagesList.find(l => l.countryCode === countryCode);

    return language.languageCode;
  };

  const onCountryChanged = countryCode => {
    setSelectedCountry(countryCode);

    const languageCodeForCountry = getLanguageCodeForCountry(countryCode);
    onLanguageChange(languageCodeForCountry);
  };

  return (
    <ReactFlagsSelect
      className="languageSelector"
      countries={getCountryCodeArray()}
      customLabels={getCustomLabels()}
      fullWidth={false}
      onSelect={code => onCountryChanged(code)}
      placeholder="Select Language"
      selectButtonClassName="languageSelector--button"
      selected={selectedCountry}
    />
  );
};

export default LanguageSelector;
