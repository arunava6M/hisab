'use client';
import React, { useEffect, useState, useRef } from 'react';
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
import dynamic from 'next/dynamic';

const SuccessAnimation = dynamic(
  () => import('./component/atoms/SuccessAnimation/Success'),
  { ssr: false }
);

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

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expenses]);

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
      setExpenses(expense.reverse());
      const categories = resp[2].data;
      if (categories.length === 0) {
        setOpenAddTag(true);
      }
      setCategories(categories);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    await addExpense(authToken, data);
    setShowAnimation(true);
    const expensesResponse = await getExpenses(authToken);
    const newlyAddedExpense = expensesResponse.data[0];
    setExpenses((prev) => [...prev, newlyAddedExpense]);
    // setExpenses(expensesResponse.data);
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
      <ExpenseMain>
        <ExpenseWrapper>
          {expenses.slice().map((each, index) => (
            <Expense
              lastRef={(() => {
                // if (index === expenses.length - 1) return lastExpenseRef;
                // if (index === 0) return topMessageRef;
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
          <div ref={lastMessageRef}> lastMessageRef </div>
        </ExpenseWrapper>
      </ExpenseMain>
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
                <>
                  {each.sharedWith.length > 0 && (
                    <StarImage
                      height={15}
                      width={15}
                      src="/icon/star.png"
                      alt="Add icon"
                    />
                  )}
                  <Emoji key={index} onClick={() => handleEmojiClick(each._id)}>
                    {each.icon}
                  </Emoji>
                </>
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

const StarImage = styled(Image)`
  margin: 0 -13px 0 0;
  z-index: 1;
  align-self: end;
  width: 15px;
  height: 15px;
  padding: 3px;
  background-color: black;
  border-radius: 50%;
`;

export const SignOut = styled(SignUp)`
  width: 40px;
  position: absolute;
  margin: 10px;
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const ExpenseMain = styled.div`
  overflow: scroll;
  height: calc(100% - 320px);
  margin-top: 60px;
`;

const ExpenseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 20px;
  // overflow: hidden;
  flex: 3;
  width: 100%;
  // height: 100%;
  // margin-top: 100px;
  // overflow-anchor: none;
  // background-color: red;
`;

const InputWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 10px 10px 0 10px;
  flex: 1;
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
  box-shadow: 0px 0px 19px -3px rgba(0, 0, 0, 0.37);
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
