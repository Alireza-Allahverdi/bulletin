import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useNavigate } from 'react-router';
import LoadingPage from './pages/loadingPage/LoadingPage';
import "./styles/App.scss"
import { useSelector } from 'react-redux';
import 'swiper/css';
import "swiper/css/pagination";
import 'react-loading-skeleton/dist/skeleton.css'
import Footer from './components/footer/Footer';
import { fetchApi } from './api/FetchApi';
import "leaflet/dist/leaflet.css"
import EmailSignIn from './pages/auth/EmailSignIn';

const Home = lazy(() => import('./pages/home/Home'))
const SignIn = lazy(() => import('./pages/auth/SignIn'))
const SignUp = lazy(() => import('./pages/auth/SignUp'))
const UserInformationForm = lazy(() => import('./pages/auth/UserInformationForm'))
const Verify = lazy(() => import('./pages/auth/Verify'))
const Groups = lazy(() => import('./pages/groups/Groups'))
const Discover = lazy(() => import('./pages/discover/Discover'))
const NewGroup = lazy(() => import('./pages/newGroup/NewGroup'))
const Profile = lazy(() => import('./pages/profile/Profile'))
const ContactUs = lazy(() => import('./pages/contactus/ContactUs'))
const AboutUs = lazy(() => import('./pages/aboutus/AboutUs'))
const SupportUs = lazy(() => import('./pages/supportUs/SupportUs'))
const MyActivity = lazy(() => import('./pages/myActivity/MyActivity'))
const Setting = lazy(() => import('./pages/userSetting/Setting'))
const Chats = lazy(() => import('./pages/chats/Chats'))
const ChatIn = lazy(() => import('./pages/chats/ChatIn'))
const GroupHome = lazy(() => import('./pages/groupHome/GroupHome'))
const GroupSetting = lazy(() => import('./pages/groupSetting/GroupSetting'))
const Topics = lazy(() => import('./pages/topics/Topics'))
const TopicOne = lazy(() => import('./pages/topics/TopicOne'))
const Members = lazy(() => import('./pages/groupMembers/Members'))
const Notes = lazy(() => import('./pages/notes/Notes'))
const Documents = lazy(() => import('./pages/documents/Documents'))
const Events = lazy(() => import('./pages/events/Events'))
const EventOne = lazy(() => import('./pages/events/EventOne'))
const NoteOne = lazy(() => import('./pages/notes/NoteOne'))
const VerifyInstitution = lazy(() => import('./pages/verifyInstitution/VerifyInstitution'))
const SearchPage = lazy(() => import('./pages/searchPage/SearchPage'))
const BussinnessPayment = lazy(() => import('./pages/bussinessPayment/BussinessPayment'))
const GroupBussinnessPayment = lazy(() => import('./pages/bussinessPayment/GroupBussinessPayment'))
const PaymentTrue = lazy(() => import('./pages/payment/PaymentTrue'))
const PaymentFalse = lazy(() => import('./pages/payment/PaymentFalse'))
const TermAndCondition = lazy(() => import('./pages/termAndCondition/TermAndCondition'))

function App() {

  const CHECK_TOKEN = "user/valid/token"

  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)
  const pageLoaderState = useSelector((state) => state.loader.pageLoader)
  const footerState = useSelector((state) => state.footer.footerState)

  useEffect(() => {
    fetchApi(CHECK_TOKEN, "", false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          return
        }
        else {
          navigate("/signin", { replace: true })
        }
      })
  }, [])

  return (
    <div className="App">
      <Toaster
        position='top-center'
        reverseOrder={false}
      />
      {
        pageLoaderState ?
          <LoadingPage />
          : ""
      }
      {/* <ButtonComp innerText={"join"} light={true} /> */}
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<LoadingPage />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path="/signin"
          element={
            <Suspense fallback={<LoadingPage />}>
              <SignIn />
            </Suspense>
          }
        />
        <Route
          path="/emailSignin"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EmailSignIn />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<LoadingPage />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="/verify"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Verify />
            </Suspense>
          }
        />
        <Route
          path="/completeInfo"
          element={
            <Suspense fallback={<LoadingPage />}>
              <UserInformationForm />
            </Suspense>
          }
        />
        <Route
          path="/groups"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Groups />
            </Suspense>
          }
        />
        <Route
          path="/discover"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Discover />
            </Suspense>
          }
        />
        <Route
          path="/newgroup"
          element={
            <Suspense fallback={<LoadingPage />}>
              <NewGroup />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/profiles/:id"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/contactus"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContactUs />
            </Suspense>
          }
        />
        <Route
          path="/aboutus"
          element={
            <Suspense fallback={<LoadingPage />}>
              <AboutUs />
            </Suspense>
          }
        />
        <Route
          path="/support"
          element={
            <Suspense fallback={<LoadingPage />}>
              <SupportUs />
            </Suspense>
          }
        />
        <Route
          path="/myactivity"
          element={
            <Suspense fallback={<LoadingPage />}>
              <MyActivity />
            </Suspense>
          }
        />
        <Route
          path="/setting"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Setting />
            </Suspense>
          }
        />
        <Route path="/group" >
          <Route
            path=":id"
            element={
              <Suspense fallback={<LoadingPage />}>
                <GroupHome />
              </Suspense>
            }
          />
          <Route
            path=":id/members"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Members />
              </Suspense>
            }
          />
          <Route
            path=":id/docs"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Documents />
              </Suspense>
            }
          />
          <Route
            path=":id/events"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Events />
              </Suspense>
            }
          />
          <Route
            path=":id/events/:eventid"
            element={
              <Suspense fallback={<LoadingPage />}>
                <EventOne />
              </Suspense>
            }
          />
          <Route
            path=":id/notes"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Notes />
              </Suspense>
            }
          />
          <Route
            path=":id/notes/:noteid"
            element={
              <Suspense fallback={<LoadingPage />}>
                <NoteOne />
              </Suspense>
            }
          />
          <Route
            path=":id/topics"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Topics />
              </Suspense>
            }
          />
          <Route
            path=":id/topics/:topicId"
            element={
              <Suspense fallback={<LoadingPage />}>
                <TopicOne />
              </Suspense>
            }
          />
          <Route
            path=":id/setting"
            element={
              <Suspense fallback={<LoadingPage />}>
                <GroupSetting />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/chats">
          <Route
            index
            element={
              <Suspense fallback={<LoadingPage />}>
                <Chats />
              </Suspense>
            }
          />
          <Route
            path=":id"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ChatIn />
              </Suspense>
            }
          />
        </Route>
        <Route path='/payment'>
          <Route
            path='true'
            element={
              <Suspense fallback={<LoadingPage />}>
                <PaymentTrue />
              </Suspense>
            }
          />
          <Route
            path='false'
            element={
              <Suspense fallback={<LoadingPage />}>
                <PaymentFalse />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/verifyInstitution/:id"
          element={
            <Suspense fallback={<LoadingPage />}>
              <VerifyInstitution />
            </Suspense>
          }
        />
        <Route
          path='/bussinessPayment'
          element={
            <Suspense fallback={<LoadingPage />}>
              <BussinnessPayment />
            </Suspense>
          }
        />
        <Route
          path='/groupBussinessPayment'
          element={
            <Suspense fallback={<LoadingPage />}>
              <GroupBussinnessPayment />
            </Suspense>
          }
        />
        <Route
          path='/terms'
          element={
            <Suspense fallback={<LoadingPage />}>
              <TermAndCondition />
            </Suspense>
          }
        />
      </Routes>
      {
        footerState ?
          <Footer />
          : ''
      }
    </div>
  );
}

//* instead of these we will use, useSelector and useDispatch
// const mapStateToProps = (state) => {
//   return {
//     loadingPageState: state.payLoader
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     setsth: (someName !optional if we had payload) => dispatch(somefunc(someName !optional if we had payload))
//     ? then we will have to given the wanted state to the props.setsth when we call it like onClick={() => props.setsth(to be changed name)}
//   }
// }
// export default connect(mapStateToProps,mapDispatchToProps)(App);

export default App