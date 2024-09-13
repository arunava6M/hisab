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
  height: 100vh;
  background-color: #f9f9fa;
`;

const MessageWrapper = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const Message = styled.div`
  bottom: 0;
  width: max-content;
  padding: 10px;
  margin: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const MessageAmtRow = styled.div`
  display: flex;
  align-items: center;
`;

const DescriptionRow = styled.div`
  background-color: #d0f0c0;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  color: black;
`;

const Amount = styled.div`
  bottom: 0;
  width: max-content;
  border-radius: 5px;
  background-color: #d0f0c0;
  margin-right: 5px;
  padding: 5px 10px;
`;

const Tag = styled.div`
  font-size: 28px;
`;
const InputWrapper = styled.div`
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const EmojiContainer = styled.div`
  display: flex;
  max-width: 70%;
  margin: 0 10px 0 0;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 20px;
  -webkit-box-shadow: inset -2px 24px 49px -55px rgba(0, 0, 0, 1);
  -moz-box-shadow: inset -2px 24px 49px -55px rgba(0, 0, 0, 1);
  box-shadow: inset -2px 24px 49px -55px rgba(0, 0, 0, 1);
  overflow-x: scroll;
  overflow-y: hidden;
`;
const Emoji = styled.div`
  margin: 5px;
`;

const InputContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  //background: aquamarine;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: black;
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
  margin: 0 0 10px 0;
`;

const ChatApp = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<
    Array<{ [key: string]: string | number }>
  >([]);
  const [enteredAmount, setEnteredAmount] = useState('');
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
        querySnapshot.forEach((doc) => {
          const d = doc.data();
          const tagObj = tags.find((each) => each.id === d.tag);
          if (tagObj) {
            let tempMessage: {
              id: string;
              tag: string;
              amount: number;
              description?: string;
            } = { id: doc.id, tag: tagObj.tag, amount: d.amount };
            if (d.description) {
              tempMessage = { ...tempMessage, description: d.description };
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
    // router.push("/signin")
    return null;
  }

  const handleEmojiClick = async (id: string) => {
    if (parseInt(enteredAmount) === 0) {
      return null;
    }

    let data: { amount: number; tag: string; description?: string } = {
      amount: parseInt(String(enteredAmount)),
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
      await updateTagSpent(user.uid, id, parseInt(String(enteredAmount)));
    setEnteredAmount('');
    setEnteredDescription('');
    setDescriptionOpen(false);
  };

  return (
    <PageWrapper>
      <SignOut
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
      </DetailsButton>
      <MessageWrapper>
        {messages.map((each, index) => (
          <Message
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <MessageAmtRow>
              <Amount>{each.amount}</Amount>
              <Tag>{each?.tag}</Tag>
            </MessageAmtRow>
            {each.description && (
              <DescriptionRow>{each.description}</DescriptionRow>
            )}
          </Message>
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
          <Button
            onClick={() => setOpenAddTag(true)}
            name="+"
            variant="circle"
          />
        </TagWrapper>
        <InputContainer>
          <MoneySymbol>₹</MoneySymbol>
          <Input
            onChange={(e) => {
              setEnteredAmount(e.target.value);
            }}
            value={enteredAmount}
            margin="10px"
          />
          <DescriptionButton
            onClick={() => setDescriptionOpen(!descriptionOpen)}
          >
            ✏️
          </DescriptionButton>
        </InputContainer>
        {descriptionOpen && (
          <DescriptionInput
            placeholder={'Enter description ...'}
            value={enteredDescription}
            onChange={(e) => {
              setEnteredDescription(e.target.value);
            }}
          />
        )}
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
