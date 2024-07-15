/* eslint-disable react/prop-types */
// Section.js
import SectionColumn from './SectionColumn';
import SectionContent from './SectionContent';
import SectionRow from './SectionRow';

export default function Section(props) {
  const { children, ...rest } = props;
  return (
    <SectionRow {...rest} style={{ width: '100%' }}>
      <SectionColumn style={{ width: '100%' }}>
        <SectionContent style={{ width: '100%' }}>{children}</SectionContent>
      </SectionColumn>
    </SectionRow>
  );
}
