import moment from 'moment';

export const formatDate = function(d) {
  return (d ? moment(d).format('MMM DD, YY') : '');
};
