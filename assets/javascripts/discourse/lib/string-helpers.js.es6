  let decodeHTMLEntities = (text) => {
    const entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    text = text || ""

    entities.forEach((entity) => {
      text = text.replace(new RegExp('&'+entity[0]+';', 'g'), entity[1]);
    });

    return text;
  };

export { decodeHTMLEntities } ;
