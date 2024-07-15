/* eslint-disable react/prop-types */
// Section.js
import ParticipantColumn from './ParticipantColumn';
import ParticipantContent from './ParticipantContent';
import ParticipantRow from './ParticipantRow';

export default function ParticipantSection(props) {
  const { children, ...rest } = props;
  return (
    <ParticipantRow {...rest} style={{ width: '100%' }}>
      <ParticipantColumn style={{ width: '100%' }}>
        <ParticipantContent style={{ width: '100%' }}>{children}</ParticipantContent>
      </ParticipantColumn>
    </ParticipantRow>
  );
}
