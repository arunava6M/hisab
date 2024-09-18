'use client';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../context/authContext';
import { useRouter } from 'next/navigation';
import addSpentData, { updateTagSpent } from '../firebase/firestore/addData';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { query, orderBy } from '@firebase/firestore';
import { handleSignOut } from '../firebase/auth/signup';
import { SignUp } from './signup/page';
import { db } from '../firebase/config';
import { Input } from './component/atoms/Input';
import { Button } from './component/atoms/Button';
import { AddTag } from './component/molecules/AddTag/AddTag';
import Image from 'next/image';
import { Text } from './component/atoms/Text';

export const SignOut = styled(SignUp)`
  width: 40px;
  position: absolute;
  margin: 10px;
`;

const DetailsButton = styled(SignOut)`
  right: 50px;
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageWrapper = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  width: 100%;
`;

const Message = styled.div<{ borderColor: string }>`
  bottom: 0;
  padding: 10px;
  margin: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  background-color: #fff;
  border-radius: 10px;
  border: ${({ borderColor }) => `0.5px solid ${borderColor}`};
  box-shadow: 0px 7px 24px -11px rgba(0, 0, 0, 0.15);
`;

const MessageAmtRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DescriptionRow = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 5px 5px 5px 10px;
`;

const Amount = styled.div`
  bottom: 0;
  width: max-content;
  border-radius: 5px;
  margin-right: 5px;
  padding: 5px 10px;
`;

const Tag = styled.div`
  font-size: 20px;
`;
const InputWrapper = styled.div`
  padding: 10px;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const EmojiContainer = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  max-width: 70%;
  margin: 0 10px 0 0;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 20px;
  overflow-x: scroll;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const Emoji = styled.div`
  margin: 5px;
`;

const InputContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: black;
  // box-shadow: 0px 7px 42px -15px rgba(0, 0, 0, 0.51);
  box-shadow: 0px 0px 19px -3px rgba(0, 0, 0, 0.37);
  // margin-bottom: 80px;
`;

const MoneySymbol = styled.div`
  width: 20px;
  color: cadetblue;
  font-size: 20px;
`;

const DescriptionButton = styled.button`
  border: none;
  outline: none;
  background: none;
`;

const DescriptionInput = styled.textarea`
  height: max-content;
  width: 100%;
  margin-top: 10px;
  background: inherit;
  border-radius: 5px;
  padding: 10px;
  color: black;
`;

const Dialog = styled.dialog`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TagWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 20px 0;
`;

const DateLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Line = styled.div`
  border-top: 1px solid grey;
  flex-grow: 1;
  margin: 0 10px;
`;

const ChatApp = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<
    Array<{ [key: string]: string | number }>
  >([]);
  const [enteredAmount, setEnteredAmount] = useState(0);
  const [tags, setTags] = useState<Array<{ [key: string]: string }>>([]);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [enteredDescription, setEnteredDescription] = useState('');
  const [openAddTag, setOpenAddTag] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user == null) router.push('/signin');
  }, [user, router]);

  useEffect(() => {
    if (user) {
      const tagCollectionRef = collection(db, 'users', user?.uid, 'tag');

      const tagUnsubscribe = onSnapshot(tagCollectionRef, (querySnapshot) => {
        const tagsArray: Array<{ [key: string]: string }> = [];
        querySnapshot.forEach((doc) => {
          tagsArray.push({ id: doc.id, ...doc.data() });
        });
        console.log('tagsArray: ', tagsArray);
        setTags(tagsArray);
      });
      return () => {
        tagUnsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (user && tags.length > 0) {
      const spentCollectionRef = collection(db, 'users', user?.uid, 'spent');

      const q = query(spentCollectionRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const spentData: Array<{ [key: string]: string | number }> = [];
        let tempDate = '';
        querySnapshot.forEach((doc) => {
          const d = doc.data();
          const dateRaw = new Date(
            d.createdAt.seconds * 1000 + d.createdAt.nanoseconds / 1000000
          );
          const date = dateRaw.toLocaleDateString();
          const time = dateRaw.toLocaleTimeString();
          const tagObj = tags.find((each) => each.id === d.tag);
          if (tagObj) {
            let tempMessage: {
              id: string;
              tag: string;
              amount: number;
              description?: string;
              date?: string;
              time: string;
            } = {
              id: doc.id,
              tag: tagObj.tag,
              amount: d.amount,
              time,
            };
            if (d.description) {
              tempMessage = { ...tempMessage, description: d.description };
            }
            if (tempDate === '') {
              tempMessage = { ...tempMessage, date };
              tempDate = date;
            } else if (date !== tempDate) {
              tempMessage = { ...tempMessage, date };
              tempDate = date;
            }

            spentData.push(tempMessage);
          }
        });
        setMessages(spentData);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user, tags]);

  useEffect(() => {
    if (lastMessageRef.current) {
      console.log('into asdfas');
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (user == null) {
    return null;
  }

  const handleEmojiClick = async (id: string) => {
    if (enteredAmount === 0) {
      return null;
    }

    let data: { amount: number; tag: string; description?: string } = {
      amount: enteredAmount,
      tag: id,
    };
    if (enteredDescription) {
      data = { ...data, description: enteredDescription };
    }
    const { result, error } = await addSpentData(user.uid, data);
    if (error) {
      console.log(error);
    }
    const { result: updateTagResult, error: updateTagError } =
      await updateTagSpent(user.uid, id, enteredAmount);
    setEnteredAmount(0);
    setEnteredDescription('');
    setDescriptionOpen(false);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <PageWrapper>
      {/* <SignOut
        onClick={() => {
          handleSignOut().then(() => router.push('/signin'));
        }}
      >
        👋
      </SignOut>
      <DetailsButton
        onClick={() => {
          router.push('/details');
        }}
      >
        📈
      </DetailsButton> */}
      <MessageWrapper>
        {messages.map((each, index) => (
          <>
            {each.date && (
              <DateLine key={index}>
                <Line />
                <Text variant="light">{each.date}</Text>
                <Line />
              </DateLine>
            )}

            <Message
              ref={index === messages.length - 1 ? lastMessageRef : null}
              key={index}
              borderColor={getRandomColor()}
            >
              <MessageAmtRow>
                <Tag>{each?.tag}</Tag>
                <DescriptionRow>
                  <Text variant="small">{each?.description}</Text>
                  <Text variant="light">{each.time}</Text>
                </DescriptionRow>
                <Amount>
                  <Text variant="bold">{`₹ ${each.amount}`}</Text>
                </Amount>
              </MessageAmtRow>
            </Message>
          </>
        ))}
      </MessageWrapper>
      <InputWrapper>
        <TagWrapper>
          <EmojiContainer>
            {tags.map((each, index) => (
              <Emoji key={index} onClick={() => handleEmojiClick(each.id)}>
                {each.tag}
              </Emoji>
            ))}
          </EmojiContainer>
          <DescriptionButton onClick={() => setOpenAddTag(true)}>
            <Image height={20} width={20} src="/icon/add.svg" alt="Add icon" />
          </DescriptionButton>
        </TagWrapper>
        <InputContainer>
          <MoneySymbol>₹</MoneySymbol>
          <Input
            onChange={(e) => {
              setEnteredAmount(parseInt(e.target.value));
            }}
            value={enteredAmount}
            margin="10px"
            type="number"
          />
          <Input
            onChange={(e) => {
              setEnteredDescription(e.target.value);
            }}
            value={enteredDescription}
            margin="10px"
            type="text"
            placeholder={'Enter description ...'}
            width="800px"
          />
          {/* <DescriptionButton
            onClick={() => setDescriptionOpen(!descriptionOpen)}
          >
            <Image width={20} height={20} src="/icon/edit.svg" alt="edit" />
          </DescriptionButton> */}
          {/* {descriptionOpen && (
            <DescriptionInput
              placeholder={'Enter description ...'}
              value={enteredDescription}
              onChange={(e) => {
                setEnteredDescription(e.target.value);
              }}
            />
          )} */}
        </InputContainer>
      </InputWrapper>
      {openAddTag && (
        <Dialog>
          <AddTag handleClose={setOpenAddTag} />
        </Dialog>
      )}
    </PageWrapper>
  );
};

export default ChatApp;
