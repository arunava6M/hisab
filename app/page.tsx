'use client'
import styled from 'styled-components';
import {useState, useEffect, useRef} from "react";
import { useAuthContext } from "../context/authContext";
import { useRouter } from "next/navigation";
import addSpentData from "../firebase/firestore/addData";
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import {query, orderBy} from "@firebase/firestore";
import {handleSignOut} from '../firebase/auth/signup'
import {SignUp} from './signup/page'
import { db } from '../firebase/config';

const SignOut = styled(SignUp)`
  width: 40px;
  position: absolute;
  margin: 10px;
  
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F9F9FA;
`

const MessageWrapper = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`

const Message = styled.div`
  bottom: 0;
  width: max-content;
  padding: 10px;
  margin: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  max-width: 100%; 
  `

const MessageAmtRow = styled.div`
  display: flex;
  align-items: center;
`

const DescriptionRow = styled.div`
  background-color: #D0F0C0;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  color: black;
  
`

const Amount = styled.div`
  bottom: 0;
  width: max-content;
  border-radius: 5px;
  background-color: #D0F0C0;
  margin-right: 5px;
  padding: 5px  10px;
`

const Tag = styled.div`
 font-size: 28px;
`
const InputWrapper = styled.div`
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const EmojiContainer = styled.div`
  display: flex;
  max-width: 100%;
  height: 30px;
  //background: cadetblue;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 20px;
  -webkit-box-shadow: inset -2px 24px 49px -55px rgba(0,0,0,1);
  -moz-box-shadow: inset -2px 24px 49px -55px rgba(0,0,0,1);
  box-shadow: inset -2px 24px 49px -55px rgba(0,0,0,1);
  overflow-x: scroll;
  overflow-y: hidden;
`
const Emoji = styled.div`
  margin: 5px;
`

const InputContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  //background: aquamarine;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: black;
`

const MoneySymbol = styled.div`
  width: 20px;
  color: cadetblue;
  font-size: 20px;
`
const Input = styled.input`
  width: 100%;
  padding: 10px;
  outline: none;
  border: none;
  background: none;
  color: black;
  &:focus{
    outline: none;
  }
`

const SmileyInput = styled(Input)`
  width: 40px;
  height: 10px;
  border: 1px solid orange;
  margin: 10px 10px;
  border-radius: 8px;
`

const SmileyWordInput = styled(SmileyInput)`
  width: 100px;
`

const DescriptionButton = styled.button`
  border: none;
  outline: none;
  background: none;
`

const DescriptionInput = styled.textarea`
  height: max-content;
  width: 100%;
  margin-top: 10px;
  background: inherit;
  border-radius: 5px;
  padding: 10px;
  color: black;
`

const Dialog = styled.dialog`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  //background: none;
  //bac: 20%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DialogContent = styled.div`
  background-color: white;
  margin: auto;
  padding: 10px;
  border-radius: 8px;
  color: black;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const EmojiInputRow = styled(MessageAmtRow)`
  width: 100%;
  justify-content: space-between;
`

const TagWrapper = styled.div`
  display: flex;
`

const AddTag = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  outline: none;
  border: none;
  margin-left: 20px;
  background-color: #c0cbf0;
  color: black;
`

const ChatApp = () => {
  const {user} =useAuthContext()
  const [messages, setMessages] = useState<Array<{[key: string]: string}>>([])
  const [enteredAmount, setEnteredAmount] = useState('')
  const emojis = [ '🚗','🥦','🍕','🚗','🥦']
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const [enteredDescription, setEnteredDescription] = useState('')
  const [addTag, setAddTag] = useState(true)
  const router = useRouter()
  const lastMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user == null) router.push("/signin")
  }, [user, router])

  useEffect(() => {
    if(user){
      const spentCollectionRef = collection(db, 'users', user?.uid, 'spent');
      const q = query(spentCollectionRef,  orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const spentData: Array<{[key: string]: string}> = [];
        querySnapshot.forEach((doc) => {
          spentData.push({ id: doc.id, ...doc.data() });
        });
        setMessages(spentData)
      });
  
      return () => unsubscribe();
    }
  
  }, []);

  useEffect(()=> {
    if(lastMessageRef.current){
      console.log('into asdfas')
      lastMessageRef.current.scrollIntoView({behavior: 'smooth'})
    }
  },[messages])

  if (user == null) {
    router.push("/signin")
    return null
  }

  const handleEmojiClick = async (index: number) => {
    if(parseInt(enteredAmount) === 0 ){
      return null
    }

    let data: {amount: number, tag: string, description?: string} = {
      amount: parseInt(String(enteredAmount)),
      tag: emojis[index]
    }
    if(enteredDescription){
      data = {...data, description: enteredDescription}
    }
    const { result, error } = await addSpentData(user.uid, data)
    if (error) {
      console.log(error)
    }
    setEnteredAmount('')
    setEnteredDescription('')
    setDescriptionOpen(false)
  }

  const Modal = () => {
    return (
        <Dialog>
          <DialogContent>
              <h3>#Add_a_Tag</h3>
              <br/>
              <h4>Ex: 🥦 = vegetables</h4>
              <br/>
              <EmojiInputRow>
                <SmileyInput/> = <SmileyWordInput />
              </EmojiInputRow>
              <button type="button" onClick={() => setAddTag(false)}>Close Modal</button>
          </DialogContent>
        </Dialog>
    );
  }

  return (
    <PageWrapper>
      <SignOut onClick={() => {
        handleSignOut().then(() => router.push('/signin'))

      }}>👋</SignOut>
      <MessageWrapper>
        {messages.map((each, index) => (
          <Message key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
            <MessageAmtRow>
              <Amount>{each.amount}</Amount>
              <Tag>{each.tag}</Tag>
            </MessageAmtRow>
            {each.description && <DescriptionRow>{each.description}</DescriptionRow>}
          </Message>
        ))}
      </MessageWrapper>
      <InputWrapper>
        <TagWrapper>
          <EmojiContainer>
            {emojis.map((each, index) => <Emoji key={index} onClick={() => handleEmojiClick(index)}>{each}</Emoji>)}
          </EmojiContainer>
          <AddTag>+</AddTag>
        </TagWrapper>
        <InputContainer>
          <MoneySymbol>₹</MoneySymbol>
          <Input placeholder='Enter amount' type='number' value={enteredAmount} onChange={e => {
            setEnteredAmount(e.target.value)
          }}/>
          <DescriptionButton onClick={()=> setDescriptionOpen(!descriptionOpen)}>✏️</DescriptionButton>
        </InputContainer>
        {descriptionOpen && <DescriptionInput placeholder={'Enter description ...'} value={enteredDescription} onChange={e => {
          setEnteredDescription(e.target.value)
        }}/>}
      </InputWrapper>
      {/* <Modal/> */}
    </PageWrapper>
  );
};

export default ChatApp;

