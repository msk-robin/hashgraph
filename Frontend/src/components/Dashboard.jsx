import PolicyForm from "./PolicyForm";
import RiskCheck from "./RiskCheck";
import DAOGovernance from "./DAOGovernance";

export default function Dashboard({ onError }) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PolicyForm onError={onError} />
          <RiskCheck onError={onError} />
        </div>
        <DAOGovernance onError={onError} />
      </div>
    </div>
  );
}
