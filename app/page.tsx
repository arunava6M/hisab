'use client';
import React, {
  useEffect,
  useState,
  useRef,
  Fragment,
  useCallback,
} from 'react';
import { useAuthContext } from '../context/authContext';
import { useRouter } from 'next/navigation';
import {
  addExpense,
  getCategories,
  getExpenses,
  getUserDetails,
} from '../helper/api';
import styled from 'styled-components';
import { Input } from './component/atoms/Input';
import { Expense } from './component/molecules/Expense';
import { AddCategory } from './component/molecules/AddCategory';
import { SignUp } from './signup/page';
import Image from 'next/image';
import { CategoryType, ExpenseType, UserType } from './utils/commonTypes';
import Cookies from 'js-cookie';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { genericCatch, showDateLine } from './utils/helper';

const SuccessAnimation = dynamic(
  () => import('./component/atoms/SuccessAnimation/Success'),
  { ssr: false }
);

const DashboardPage: React.FC<{}> = () => {
  const { setUser } = useAuthContext();
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [userDetails, setUserDetails] = useState<UserType>();
  const [enteredAmount, setEnteredAmount] = useState(0);
  const [enteredDescription, setEnteredDescription] = useState('');
  const [openAddTag, setOpenAddTag] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollToLast, setScrollToLast] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [isVisible, setsVisible] = useState(false);

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const expenseWrapperRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setsVisible(entries[0].isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);
  const authToken = Cookies.get('authToken');
  const router = useRouter();

  useEffect(() => {
    if (scrollToLast && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      const scrollTop = window.pageYOffset;
      const scrollLeft = window.pageXOffset;
      window.scrollTo(scrollLeft, scrollTop);
    }
  }, [expenses, scrollToLast]);

  useEffect(() => {
    Promise.all([
      getUserDetails(authToken),
      getExpenses(authToken),
      getCategories(authToken),
    ])
      .then((resp) => {
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
      })
      .catch((error) => genericCatch(error, router));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  useEffect(() => {
    if (isVisible) loadMoreExpense();
  }, [isVisible]);

  if (loading) return <Loading />;

  if (!authToken) return null;

  const fetchCategories = async () => {
    try {
      const categories = await getCategories(authToken);
      setCategories(categories.data);
    } catch (error) {
      genericCatch(error, router);
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
    setScrollToLast(true);
    setExpenses((prev) => [...prev, newlyAddedExpense]);
    setEnteredAmount(0);
    setEnteredDescription('');
  };

  const loadMoreExpense = async () => {
    const container = expenseWrapperRef.current;
    const prevHeight = container?.scrollHeight;
    const nextPage = page + 1;
    const { data } = await getExpenses(authToken, nextPage);
    const expenseData = data.reverse();
    setPage(nextPage);
    setScrollToLast(false);
    setExpenses((prev) => [...expenseData, ...prev]);

    requestAnimationFrame(() => {
      const newScrollHeight = container?.scrollHeight;
      const scrollDiff = newScrollHeight - prevHeight;
      container.scrollTop += scrollDiff;
    });
  };

  return (
    <PageWrapper>
      {showAnimation && (
        <SuccessAnimation onComplete={() => setShowAnimation(false)} />
      )}
      <ExpenseMain ref={expenseWrapperRef}>
        <ExpenseWrapper>
          <div onClick={loadMoreExpense} ref={loadMoreRef} />
          {expenses.slice().map((each, index) => (
            // eslint-disable-next-line react/jsx-key
            <Expense
              expense={each}
              uniqueKey={index}
              showDateLine={
                index > 0
                  ? showDateLine(each.date, expenses[index - 1].date)
                  : true
              }
            />
          ))}
          <div ref={lastMessageRef} />
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
                <Fragment key={index}>
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
                </Fragment>
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
  margin-top: 70px;
`;

const ExpenseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 20px;
  flex: 3;
  width: 100%;
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
