import { Flex } from '@atoms/Basic';
import { MemoizedUserList } from '@atoms/UserList';
import { Text } from '@atoms/Text';
import styled from 'styled-components';
import ProgressBar from 'app/(protected)/details/progressBar';
import { getColorFromValue } from '@utils/helper';
import Image from 'next/image';

interface BarDetailsProps {
  icon: string;
  description: string;
  spent: number;
  budget: number;
}

const BarDetails = ({ icon, description, spent, budget }: BarDetailsProps) => {
  const floatPercentageSpent = parseFloat(
    ((Number(spent) / Number(budget)) * 100).toFixed(2)
  );
  const colorBar = getColorFromValue(floatPercentageSpent);

  return (
    <>
      <Flex j="flex-start" a="center" minH="35px" h="35px">
        <Flex
          m="0 10px 0 0"
          w="auto"
          b="1px solid #c2c2c2"
          br="10px"
          p="5px"
          o="visible"
        >
          {icon}
        </Flex>
        {/* {sharedBetween.length > 1 && <MemoizedUserList list={sharedBetween} />} */}
        <Flex a="center">
          <Text variant="small">{description}</Text>
        </Flex>
        <Flex a="center" m="0px 5px" w="38px" o="visible">
          <Image
            src="/icon/moneyIn.svg"
            width={15}
            height={15}
            alt="nav icon"
          />
        </Flex>
        <Text variant="small">{budget}</Text>
        <Flex a="center" m="0px 5px" w="38px" o="visible">
          <Image
            src="/icon/moneyOut.svg"
            width={15}
            height={15}
            alt="nav icon"
          />
        </Flex>
        <Text variant="small">{spent}</Text>
        <Percentage>
          <Text variant="bold">
            {floatPercentageSpent || 0}
            <span>%</span>
          </Text>
        </Percentage>
      </Flex>
      {/* <Flex m="10px 0"> */}
      <ProgressBar
        height={2}
        progress={floatPercentageSpent}
        progressColor={colorBar}
      />
      {/* </Flex> */}
    </>
  );
};

const Percentage = styled.div`
  margin-left: 20px;
`;

export default BarDetails;
