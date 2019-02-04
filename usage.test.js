import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";
import withRemount from "./index";

afterEach(cleanup);

test("component with hooks resets state when user id changes", () => {
  function UserCard(props) {
    const { user } = props;
    const [isExpanded, setExpanded] = React.useState(false);
    return (
      <div className="user-card">
        <div>Name: {user.name}</div>
        <div>
          <button onClick={() => setExpanded({ expanded: true })}>
            See Details
          </button>
        </div>
        {isExpanded && (
          <React.Fragment>
            <div>Birthday: {user.birthDate}</div>
            <div>Favorite Color: {user.favoriteColor}</div>
          </React.Fragment>
        )}
      </div>
    );
  }

  const RemountCard = withRemount(UserCard, (props, prevProps) => {
    const prevUserId = prevProps.user && prevProps.user.id;
    const nextUserId = props.user && props.user.id;

    if (nextUserId !== prevUserId) {
      return true; // remount!
    }

    return false; // don't remount otherwise
  });

  const userOne = {
    id: 1,
    name: "User One",
    birthDate: "1/1/1980",
    favoriteColor: "purple",
  };
  const userTwo = {
    id: 2,
    name: "User Two",
    birthDate: "2/2/1990",
    favoriteColor: "orange",
  };

  const { rerender, container, queryByText } = render(
    <RemountCard user={userOne} />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="user-card"
>
  <div>
    Name: 
    User One
  </div>
  <div>
    <button>
      See Details
    </button>
  </div>
</div>
`);
  expect(queryByText(/favorite color/)).not.toBeInTheDocument();

  fireEvent.click(queryByText("See Details"));
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="user-card"
>
  <div>
    Name: 
    User One
  </div>
  <div>
    <button>
      See Details
    </button>
  </div>
  <div>
    Birthday: 
    1/1/1980
  </div>
  <div>
    Favorite Color: 
    purple
  </div>
</div>
`);
  expect(queryByText(/favorite color/i)).not.toBeNull();

  rerender(<RemountCard user={userTwo} />);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="user-card"
>
  <div>
    Name: 
    User Two
  </div>
  <div>
    <button>
      See Details
    </button>
  </div>
</div>
`);
  expect(queryByText(/favorite color/i)).toBeNull();
});
