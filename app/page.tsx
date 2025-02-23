'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../context/authContext';
import { redirect, useRouter } from 'next/navigation';
import {
  addExpense,
  getCategories,
  getExpenses,
  getUserDetails,
} from '../helper/api';
import styled from 'styled-components';
import { Input } from './component/atoms/Input';
import { Expense } from './component/molecules/Expense';
import SuccessAnimation from './component/atoms/SuccessAnimation/Success';
import { toaster } from '../helper/helperFunc';
import { AddCategory } from './component/molecules/AddCategory';
import { SignUp } from './signup/page';
import Image from 'next/image';
import {
  CategoryType,
  ErrorType,
  ExpenseType,
  UserType,
} from './utils/commonTypes';
import Cookies from 'js-cookie';
import Loading from './loading';
import { Text } from './component/atoms/Text';

const DashboardPage: React.FC<{}> = () => {
  const { setUser } = useAuthContext();
  const [authToken, setAuthToken] = useState<string>();
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [userDetails, setUserDetails] = useState<UserType>();
  const [enteredAmount, setEnteredAmount] = useState(0);
  const [enteredDescription, setEnteredDescription] = useState('');
  const [openAddTag, setOpenAddTag] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const chatContainerRef = useRef(null);
  const topMessageRef = useRef(null);

  useEffect(() => {
    const auth_token = Cookies.get('authToken');
    if (!auth_token) {
      redirect('/signin');
    }
    setAuthToken(auth_token);
    Promise.all([
      getUserDetails(auth_token),
      getExpenses(auth_token),
      getCategories(auth_token),
    ]).then((resp) => {
      const user = resp[0].data;
      setUserDetails(user);
      setUser(user);
      const expense = resp[1].data;
      setExpenses(expense);
      const categories = resp[2].data;
      setCategories(categories);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  if (!authToken) return null;

  const genericCatch = (error: ErrorType | any) => {
    alert(error.response.data.error);
    toaster(error.response.data.error);
    if (error.response.data.error === 'Token is invalid/expired') {
      localStorage.removeItem('authToken');
      router.push('/signin');
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await getCategories(authToken);
      setCategories(categories.data);
    } catch (error) {
      genericCatch(error);
    }
  };

  const handleEmojiClick = async (id: string) => {
    if (enteredAmount === 0) {
      return null;
    }

    let data: { amount: number; category: string; description?: string } = {
      amount: enteredAmount,
      category: id,
    };
    if (enteredDescription) {
      data = { ...data, description: enteredDescription };
    }
    const result = await addExpense(authToken, data);
    setShowAnimation(true);
    const expenses = await getExpenses(authToken);
    setExpenses(expenses.data);
    setEnteredAmount(0);
    setEnteredDescription('');
  };

  const showDateLine = (current: string, previous: string) => {
    const currDate = new Date(current);
    const prevDate = new Date(previous);
    return currDate.toDateString() !== prevDate.toDateString();
  };

  const loadMoreExpense = async () => {
    const result = await getExpenses(authToken);
    setExpenses((prev) => [...prev, ...result.data]);
  };

  return (
    <PageWrapper>
      {showAnimation && (
        <SuccessAnimation onComplete={() => setShowAnimation(false)} />
      )}
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
      <ExpenseWrapper>
        {expenses
          .slice()
          .reverse()
          .map((each, index) => (
            <Expense
              lastRef={(() => {
                // if (index === expenses.length - 1) return lastExpenseRef;
                if (index === 0) return topMessageRef;
                return null;
              })()}
              expense={each}
              key={index}
              showDateLine={
                index > 0
                  ? showDateLine(each.date, expenses[index - 1].date)
                  : true
              }
            />
          ))}
      </ExpenseWrapper>
      <InputWrapper>
        <Input
          onChange={(e) => {
            setEnteredDescription(e.target.value);
          }}
          value={enteredDescription}
          margin="10px"
          type="text"
          placeholder={'Enter description ...'}
        />

        <InputContainer>
          <MoneySymbol>₹</MoneySymbol>
          <Input
            onChange={(e) => {
              setEnteredAmount(parseInt(e.target.value));
            }}
            value={enteredAmount <= 0 ? '' : enteredAmount}
            margin="10px"
            type="number"
            size="30px"
            color={enteredAmount <= 0 ? 'grey' : '#0f66a0'}
            placeholder="0.00"
            bg="none"
            width="100px"
          />
          <TagWrapper>
            <EmojiContainer>
              {categories.map((each, index) => (
                <Emoji key={index} onClick={() => handleEmojiClick(each._id)}>
                  {each.icon}
                </Emoji>
              ))}
            </EmojiContainer>
            <AddCategoryButton onClick={() => setOpenAddTag(true)}>
              <Image
                height={20}
                width={20}
                src="/icon/add.svg"
                alt="Add icon"
              />
            </AddCategoryButton>
          </TagWrapper>
        </InputContainer>
      </InputWrapper>
      {openAddTag && (
        <Dialog>
          <AddCategory
            authToken={authToken}
            handleClose={() => {
              setOpenAddTag(false);
            }}
            onSuccess={() => {
              setShowAnimation(true);
              fetchCategories();
            }}
          />
        </Dialog>
      )}
    </PageWrapper>
  );
};

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
`;

const ExpenseWrapper = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  width: 100%;
  height: 100vh;
  margin-top: 80px;
  overflow-anchor: none;
`;

const InputWrapper = styled.div`
  padding: 10px;
  margin-bottom: 80px;
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
  flex: 5;
  // max-width: 70%;
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
  font-size: 25px;
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
  font-size: 30px;
  margin-left: 10px;
`;

const AddCategoryButton = styled.button`
  flex: 1;
  border: none;
  outline: none;
  background: none;
  display: flex;
  align-items: center;
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
  justify-content: space-between;
  background: #f0f0f0;
  height: 50px;
  border-radius: 8px;
  padding: 5px 10px;
  width: 100%;
  overflow: hidden;
`;

export default DashboardPage;
