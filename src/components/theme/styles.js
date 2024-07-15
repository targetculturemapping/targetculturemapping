const styles = {
  global: () => ({
    '*': {
      boxSizing: 'border-box'
    },
    html: {
      fontFamily: 'body',
      fontSize: 'base',
      backgroundColor: 'bg',
      color: 'text'
    },
    body: {
      width: '100%',
      position: 'absolute',
      overflowX: 'hidden',
      margin: '0px',
      backgroundColor: '#FAFBFC',
      fontFamily: 'Poppins',
      fontStyle: 'normal'
    },
    // Utils
    '.disable-scroll': {
      overflowY: 'hidden'
    }
  })
};

export default styles;
